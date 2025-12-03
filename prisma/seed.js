"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
const firstNames = ["Ahmet", "Mehmet", "Ayşe", "Fatma", "Mustafa", "Zeynep", "Emre", "Selin", "Can", "Elif", "Burak", "Ceren", "Deniz", "Gamze", "Hakan"];
const lastNames = ["Yılmaz", "Kaya", "Demir", "Çelik", "Şahin", "Yıldız", "Yıldırım", "Öztürk", "Aydın", "Özdemir", "Arslan", "Doğan", "Kılıç", "Aslan", "Çetin"];
const companies = ["Medikalciniz", "Hastane A", "Klinik B", "Eczane C", "Medikal D", "Diğer"];
function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
function getRandomPhone() {
    return `+90 5${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 1000)} ${Math.floor(Math.random() * 10000)}`;
}
async function main() {
    console.log("Seeding 10 random users...");
    const passwordHash = await bcryptjs_1.default.hash("123456", 10);
    for (let i = 0; i < 10; i++) {
        const name = getRandomElement(firstNames);
        const surname = getRandomElement(lastNames);
        const email = `${name.toLowerCase()}.${surname.toLowerCase()}.${Math.floor(Math.random() * 10000)}@example.com`;
        // Ensure email uniqueness (simple check)
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            i--; // Retry
            continue;
        }
        const role = Math.random() > 0.8 ? client_1.UserRole.SALES : client_1.UserRole.CUSTOMER;
        await prisma.user.create({
            data: {
                name,
                surname,
                email,
                phone: getRandomPhone(),
                password: passwordHash,
                role: role,
                company: getRandomElement(companies),
            }
        });
        console.log(`Created user: ${name} ${surname} (${email})`);
    }
    console.log("Seeding completed.");
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
