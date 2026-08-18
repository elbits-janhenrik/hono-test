-- CreateTable
CREATE TABLE "FileUpload" (
    "id" SERIAL NOT NULL,
    "fileName" TEXT NOT NULL,
    "contents" BYTEA NOT NULL,

    CONSTRAINT "FileUpload_pkey" PRIMARY KEY ("id")
);
