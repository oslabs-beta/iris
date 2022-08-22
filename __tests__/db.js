// Here we will be unit testing the 3 main database functions from server/db/markets.js
const fs = require('fs');
const path = require('path');
const db = require('../server/databaseController.js');

const dbTestFile = path.resolve(__dirname, './db.test.json');

/**
 * Like many testing frameworks, in Jest we use the "describe" function to
 * separate our tests into sections. They make your test outputs readable.
 *
 * You can place "beforeAll", "beforeEach", "afterAll", and "afterEach"
 * functions inside of "describe" blocks and they will only run for tests
 * inside that describe block. You can even nest describes within describes!
 */
describe('db unit tests', () => {
  /**
   * Jest runs the "beforeAll" function once, before any tests are executed.
   * Here, we write to the file and then reset our database model. Then, we
   * invoke the "done" callback to tell Jest our async operations have
   * completed. This way, the tests won't start until the "database" has been
   * reset to an empty Array!
   */
  beforeAll((done) => {
    fs.writeFile(dbTestFile, JSON.stringify([]), () => {
      db.reset();
      done();
    });
  });

  afterAll((done) => {
    fs.writeFile(dbTestFile, JSON.stringify([]), done);
  });

  describe('#Adding Data', () => {
    jest.mock(db);
    it('transforms data to correct format', () => {
      console.log('transforms')
      // const marketList = [{ location: 'here', cards: 11 }, { location: 'there', cards: 0 }];
      // const result = db.sync(marketList);
      // expect(result).not.toBeInstanceOf(Error);
      // const table = JSON.parse(fs.readFileSync(dbTestFile));
      // expect(table).toEqual(marketList);
    });

    it('throws error if data exists in the database', () => {
      // const newMarketList = [{ location: 'newHere', cards: 11 }, { location: 'newThere', cards: 0 }];
      // const result = db.sync(newMarketList);
      // expect(result).not.toBeInstanceOf(Error);
      // const table = JSON.parse(fs.readFileSync(dbTestFile));
      // expect(table).toEqual(newMarketList);
    });

    it('should return lastTimeStamp', () => {
      // const newMarketList = [{ cards: 11 }, { location: 'newThere' }];
      // const result = db.sync(newMarketList);
      // expect(result).toBeInstanceOf(Error);
    });
  });

  describe('#Get historical data', () => {
    it('returns list of all markets from the json file', () => {
      const newMarketList = [{ location: 'newHere', cards: 11 }, { location: 'newThere', cards: 0 }];
      const result = db.sync(newMarketList);
      expect(result).not.toBeInstanceOf(Error);
      const table = db.find();
      expect(table).toEqual(newMarketList);
    });

    it('works if the list of markets is empty', () => {
      const newMarketList = [];
      const result = db.sync(newMarketList);
      expect(result).not.toBeInstanceOf(Error);
      const table = db.find();
      expect(table).toEqual(newMarketList);
    });
  });

  describe('#drop', () => {
    it('writes an empty array to the json file', () => {
      db.drop();
      const table = JSON.parse(fs.readFileSync(dbTestFile));
      expect(table).toEqual([]);
    });
  });
});
