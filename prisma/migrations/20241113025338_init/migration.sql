-- CreateTable
CREATE TABLE "User" (
    "slug" TEXT NOT NULL,
    "emil" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT NOT NULL DEFAULT 'defalt.jpg',
    "cover" TEXT NOT NULL DEFAULT 'defalt.jpg',
    "bio" TEXT,
    "link" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "Postagens" (
    "id" SERIAL NOT NULL,
    "userSlug" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "answerOf" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Postagens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostagensLike" (
    "id" SERIAL NOT NULL,
    "userSlug" TEXT NOT NULL,
    "postagenId" INTEGER NOT NULL,

    CONSTRAINT "PostagensLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Follow" (
    "id" SERIAL NOT NULL,
    "user1Slug" TEXT NOT NULL,
    "user2Slug" TEXT NOT NULL,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trend" (
    "id" SERIAL NOT NULL,
    "hashtag" TEXT NOT NULL,
    "counter" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Trend_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_emil_key" ON "User"("emil");

-- AddForeignKey
ALTER TABLE "Postagens" ADD CONSTRAINT "Postagens_userSlug_fkey" FOREIGN KEY ("userSlug") REFERENCES "User"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostagensLike" ADD CONSTRAINT "PostagensLike_userSlug_fkey" FOREIGN KEY ("userSlug") REFERENCES "User"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostagensLike" ADD CONSTRAINT "PostagensLike_postagenId_fkey" FOREIGN KEY ("postagenId") REFERENCES "Postagens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
