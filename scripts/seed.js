const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
    const data = JSON.parse(fs.readFileSync('data/initialQuestions.json', 'utf8'));

    for (const item of data) {
        await prisma.question.create({
            data: {
                question: item.question,
                answer: item.answer,
            }
        });
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
