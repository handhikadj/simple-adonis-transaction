import { Group, test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

const databaseSetup = (group: Group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
}

test.group('Register', (group) => {
  databaseSetup(group)

  test('Cannot register if the name is empty', async ({ client }) => {
    const response = await client.post('/register')

    response.assertStatus(422)
  })

  test('Can register', async ({ client }) => {
    const response = await client.post('/register').form({
      name: 'Michael',
    })

    response.assertStatus(200)
    response.assertBodyContains({
      id: 1,
      name: 'Michael',
      balance: '0.00',
    })
  })
})

test.group('Deposit', (group) => {
  databaseSetup(group)

  test('Cannot deposit if the userId and amount inputs are empty', async ({ client }) => {
    const response = await client.post('/deposit')

    response.assertStatus(422)
  })

  test('Cannot deposit if user is not found on db', async ({ client }) => {
    const response = await client.post('/deposit').form({
      userId: 100,
      amount: 500,
    })

    response.assertStatus(404)
    response.assertBodyContains({
      message: 'User not found',
    })
  })

  test('Can deposit', async ({ client }) => {
    const registerResponse = await client.post('/register').form({
      name: 'Michael',
    })

    const user = registerResponse.body()

    const response = await client.post('/deposit').form({
      userId: user.id,
      amount: 500,
    })

    response.assertStatus(200)
    response.assertBodyContains({
      balance: '500.00',
    })
  })

  test('Can deposit with decimal value', async ({ client }) => {
    const registerResponse = await client.post('/register').form({
      name: 'Michael',
    })

    const user = registerResponse.body()

    const response = await client.post('/deposit').form({
      userId: user.id,
      amount: 500.25,
    })

    response.assertStatus(200)
    response.assertBodyContains({
      balance: '500.25',
    })
  })
})

test.group('Withdraw', (group) => {
  databaseSetup(group)

  test('Cannot withdraw if the userId and amount inputs are empty', async ({ client }) => {
    const response = await client.post('/withdraw')

    response.assertStatus(422)
  })

  test('Cannot withdraw if user is not found on db', async ({ client }) => {
    const response = await client.post('/withdraw').form({
      userId: 100,
      amount: 500,
    })

    response.assertStatus(404)
    response.assertBodyContains({
      message: 'User not found',
    })
  })

  test('Cannot over-withdraw / having negative balance', async ({ client }) => {
    const registerResponse = await client.post('/register').form({
      name: 'Michael',
    })

    const registeredUser = registerResponse.body()

    await client.post('/deposit').form({
      userId: registeredUser.id,
      amount: 500,
    })

    const response = await client.post('/withdraw').form({
      userId: registeredUser.id,
      amount: 600,
    })

    response.assertStatus(406)
    response.assertBodyContains({
      message: 'Cannot over-withdraw / having negative balance. Current balance: 500.00',
      current_balance: '500.00',
    })
  })

  test('Can withdraw', async ({ client }) => {
    const registerResponse = await client.post('/register').form({
      name: 'Michael',
    })

    const registeredUser = registerResponse.body()

    await client.post('/deposit').form({
      userId: registeredUser.id,
      amount: 500,
    })

    const response = await client.post('/withdraw').form({
      userId: registeredUser.id,
      amount: 400,
    })

    response.assertStatus(200)
    response.assertBodyContains({
      name: 'Michael',
      current_balance: '100.00',
    })
  })

  test('Can withdraw with decimal value', async ({ client }) => {
    const registerResponse = await client.post('/register').form({
      name: 'Michael',
    })

    const registeredUser = registerResponse.body()

    await client.post('/deposit').form({
      userId: registeredUser.id,
      amount: 500,
    })

    const response = await client.post('/withdraw').form({
      userId: registeredUser.id,
      amount: 400.25,
    })

    response.assertStatus(200)
    response.assertBodyContains({
      name: 'Michael',
      current_balance: '99.75',
    })
  })

  test('Can withdraw until the balance is 0.00', async ({ client }) => {
    const registerResponse = await client.post('/register').form({
      name: 'Michael',
    })

    const registeredUser = registerResponse.body()

    await client.post('/deposit').form({
      userId: registeredUser.id,
      amount: 500.25,
    })

    const response = await client.post('/withdraw').form({
      userId: registeredUser.id,
      amount: 500.25,
    })

    response.assertStatus(200)
    response.assertBodyContains({
      name: 'Michael',
      current_balance: '0.00',
    })
  })
})
