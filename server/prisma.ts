const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const entry = await prisma.iris_database.create({
    data: {
      key: 'test2%bytes_in_per_sec%12370560.398',
      identifier: 'test2',
      metric: 'bytes_in_per_sec',
      time: 12370560.398,
      value:2398.095 , 
    },
  })

  console.log('Created new entry: ', entry)

  // const allEntries = await prisma.iris_database.findMany({
  //   include: { identifier: 'test1' },
  // })

  // console.log('All entries: ')
  // console.dir(allEntries, { depth: null })
}

main()
  .catch((e) => console.error(e))
  // .finally(async () => await prisma.disconnect())