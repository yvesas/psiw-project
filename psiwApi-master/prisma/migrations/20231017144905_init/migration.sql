-- CreateTable
CREATE TABLE `Psiw` (
    `id` VARCHAR(191) NOT NULL,
    `psiwType` VARCHAR(191) NOT NULL,
    `senderName` VARCHAR(191) NOT NULL,
    `senderWhatsapp` VARCHAR(191) NOT NULL,
    `recipientName` VARCHAR(191) NOT NULL,
    `recipientWhatsapp` VARCHAR(191) NOT NULL,
    `viewedFile` VARCHAR(191) NULL,
    `reactedFile` VARCHAR(191) NULL,
    `compiledFile` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `React` (
    `id` VARCHAR(191) NOT NULL,
    `psiwId` VARCHAR(191) NOT NULL,
    `reactedFile` VARCHAR(191) NULL,
    `compiledFile` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `React` ADD CONSTRAINT `React_psiwId_fkey` FOREIGN KEY (`psiwId`) REFERENCES `Psiw`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
