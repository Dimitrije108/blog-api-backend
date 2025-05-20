require('dotenv').config();
const { PrismaClient } = require('../generated/prisma');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const main = async() => {
	const email = process.env.ADMIN_EMAIL;
	const password = process.env.ADMIN_PASSWORD;

	if (!email || !password) {
    throw new Error('Missing ADMIN_EMAIL or ADMIN_PASSWORD in .env');
  };

	const hashedPass = await bcrypt.hash(password, 10);

	await prisma.user.create({
		data: {
			email,
			username: 'Anakin',
			password: hashedPass,
			author: true,
		}
	})
};

main()
  .catch((e) => {
    console.error('❌ Error seeding admin user:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
