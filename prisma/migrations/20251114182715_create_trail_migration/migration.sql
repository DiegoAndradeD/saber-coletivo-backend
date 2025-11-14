-- CreateTable
CREATE TABLE "Trail" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "Trail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostsOnTrails" (
    "postId" TEXT NOT NULL,
    "trailId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "PostsOnTrails_pkey" PRIMARY KEY ("postId","trailId")
);

-- AddForeignKey
ALTER TABLE "Trail" ADD CONSTRAINT "Trail_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostsOnTrails" ADD CONSTRAINT "PostsOnTrails_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostsOnTrails" ADD CONSTRAINT "PostsOnTrails_trailId_fkey" FOREIGN KEY ("trailId") REFERENCES "Trail"("id") ON DELETE CASCADE ON UPDATE CASCADE;
