-- CreateTable
CREATE TABLE `Accounts` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `balance` DOUBLE NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Accounts_id_key`(`id`),
    UNIQUE INDEX `Accounts_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transactions` (
    `id` VARCHAR(191) NOT NULL,
    `data` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `tipoTransacao` VARCHAR(191) NOT NULL,
    `valor` DOUBLE NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Transactions_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PhoneLines` (
    `msisdn` VARCHAR(191) NOT NULL,
    `accountId` VARCHAR(191) NOT NULL,
    `activated` BOOLEAN NOT NULL DEFAULT false,
    `extraCall` BOOLEAN NOT NULL DEFAULT false,
    `ringActived` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `PhoneLines_msisdn_key`(`msisdn`),
    PRIMARY KEY (`msisdn`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RingTones` (
    `ringId` VARCHAR(191) NOT NULL,
    `ringName` VARCHAR(191) NOT NULL,
    `ringAuthor` VARCHAR(191) NOT NULL,
    `filePath` VARCHAR(191) NOT NULL,
    `coverPath` VARCHAR(191) NOT NULL,
    `price` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `RingTones_ringId_key`(`ringId`),
    PRIMARY KEY (`ringId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RingTonesBuyed` (
    `buyedId` VARCHAR(191) NOT NULL,
    `accountId` VARCHAR(191) NOT NULL,
    `ringId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `RingTonesBuyed_buyedId_key`(`buyedId`),
    PRIMARY KEY (`buyedId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Transactions` ADD CONSTRAINT `Transactions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PhoneLines` ADD CONSTRAINT `PhoneLines_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `Accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PhoneLines` ADD CONSTRAINT `PhoneLines_ringActived_fkey` FOREIGN KEY (`ringActived`) REFERENCES `RingTonesBuyed`(`buyedId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RingTonesBuyed` ADD CONSTRAINT `RingTonesBuyed_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `Accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RingTonesBuyed` ADD CONSTRAINT `RingTonesBuyed_ringId_fkey` FOREIGN KEY (`ringId`) REFERENCES `RingTones`(`ringId`) ON DELETE RESTRICT ON UPDATE CASCADE;
