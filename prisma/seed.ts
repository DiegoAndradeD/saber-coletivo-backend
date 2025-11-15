// prisma/seed.ts
import { PrismaClient, type Post } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// --- Configurações do Seed ---
const NUM_USERS = 50;
const NUM_TAGS = 30;
const NUM_TRAILS = 20;
const NUM_POSTS = 200;
const POSTS_PER_TRAIL = 10;
const HASH_ROUNDS = 10;
// ------------------------------

/**
 * Retorna um elemento aleatório de um array.
 */
function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  console.log('🌱 Iniciando o processo de seed...');

  // --- 1. Limpeza do Banco de Dados ---
  // (Executado na ordem inversa das dependências para evitar conflitos FK)
  console.log('🧹 Limpando o banco de dados...');
  await prisma.postsOnTrails.deleteMany();
  await prisma.post.deleteMany();
  await prisma.trail.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();

  // --- 2. Criar Usuários ---
  console.log(`👤 Criando ${NUM_USERS} usuários...`);
  const usersData: { email: string; name: string; password: string }[] = [];
  const hashedPassword = await bcrypt.hash('password123', HASH_ROUNDS); // Senha padrão para todos

  for (let i = 0; i < NUM_USERS; i++) {
    usersData.push({
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: hashedPassword,
    });
  }
  // Usamos createMany para performance
  await prisma.user.createMany({ data: usersData });
  // Buscamos os usuários criados para obter seus IDs
  const users = await prisma.user.findMany();
  console.log(`✅ ${users.length} usuários criados.`);

  // --- 3. Criar Tags ---
  console.log(`🏷️  Criando ${NUM_TAGS} tags...`);
  // Usamos um Set para garantir nomes de tags únicos
  const tagNames = new Set<string>();
  while (tagNames.size < NUM_TAGS) {
    tagNames.add(faker.lorem.word());
  }
  const tagsData = Array.from(tagNames).map((name) => ({ name }));

  await prisma.tag.createMany({ data: tagsData });
  const tags = await prisma.tag.findMany();
  console.log(`✅ ${tags.length} tags criadas.`);

  // --- 4. Criar Trilhas (Trails) ---
  console.log(`🗺️  Criando ${NUM_TRAILS} trilhas...`);
  const trailsData: {
    title: string;
    description: string;
    creatorId: string;
  }[] = [];
  for (let i = 0; i < NUM_TRAILS; i++) {
    trailsData.push({
      title: faker.lorem.sentence({ min: 3, max: 7 }),
      description: faker.lorem.paragraph(),
      creatorId: getRandomElement(users).id, // Associa a um criador aleatório
    });
  }

  await prisma.trail.createMany({ data: trailsData });
  const trails = await prisma.trail.findMany();
  console.log(`✅ ${trails.length} trilhas criadas.`);

  // --- 5. Criar Posts ---
  // (Isso precisa ser em um loop de 'create' individual para lidar com a relação M2M com Tags)
  console.log(`📝 Criando ${NUM_POSTS} posts...`);
  const posts: Post[] = [];
  for (let i = 0; i < NUM_POSTS; i++) {
    // Seleciona de 1 a 3 tags aleatórias para o post
    const numTags = Math.floor(Math.random() * 3) + 1;
    const postTagsConnect: { id: string }[] = [];
    for (let j = 0; j < numTags; j++) {
      postTagsConnect.push({ id: getRandomElement(tags).id });
    }

    const post = await prisma.post.create({
      data: {
        title: faker.lorem.sentence(),
        description: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(100),
        authorId: getRandomElement(users).id, // Associa a um autor aleatório
        tags: {
          connect: postTagsConnect, // Conecta às tags aleatórias
        },
      },
    });
    posts.push(post);
  }
  console.log(`✅ ${posts.length} posts criados.`);

  // --- 6. Associar Posts às Trilhas (PostsOnTrails) ---
  console.log(`🔗 Associando posts às trilhas...`);
  const relationsData: { trailId: string; postId: string; order: number }[] =
    [];
  for (const trail of trails) {
    // Pega um conjunto único de posts aleatórios para esta trilha
    const trailPosts = new Set<string>();
    while (
      trailPosts.size < POSTS_PER_TRAIL &&
      trailPosts.size < posts.length
    ) {
      trailPosts.add(getRandomElement(posts).id);
    }

    let order = 1;
    for (const postId of trailPosts) {
      relationsData.push({
        trailId: trail.id,
        postId: postId,
        order: order++, // Define a ordem
      });
    }
  }

  await prisma.postsOnTrails.createMany({ data: relationsData });
  console.log(`✅ ${relationsData.length} relações post-trilha criadas.`);

  console.log('🎉 Seed finalizado com sucesso!');
}

main()
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
