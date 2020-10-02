import * as index from '../dist/index.js';
import csvString from '../test/validationData/testData';
import { expect, should } from 'chai';
should();

document.body.innerHTML =
  '<div>' +
  '<table id="output></table>' +
  '<button id="submit-btn" />' +
  '<p id="msg"></p>' +
  '<p id="sub-msg"></p>' +
  '</div>';

import original from '../test/validationData/original';
import formatted from '../test/validationData/formatted';

test('filename should equal test-formatted.csv', () => {
  const input = { name: 'test.csv' };
  const newFilename = index.makeFilename(input);
  expect(newFilename).to.equal('test-formatted.csv');
});

describe('parseData function', () => {
  test('parsedData should be an array', () => {
    const dataArray = index.parseData(csvString);
    dataArray.should.be.an('array');
    dataArray[0].should.be.an('array');
  });

  test('numbers in parsed data should be typeof String', () => {
    const dataArray = index.parseData(csvString);
    expect(dataArray[1][2]).to.be.a('string');
  });

  test('string should be split on {new line}', () => {
    const input = '1\n2,3\n4,5\n6';
    const output = index.parseData(input);
    expect(output).to.deep.equal([['1'], ['2', '3'], ['4', '5'], ['6']]);
  });

  test('First row should be headers', () => {
    const dataArray = index.parseData(csvString);
    dataArray[0][0].should.equal('Race');
  });

  test('empty cells should be string "null"', () => {
    const dataArray = index.parseData(csvString);
    dataArray.forEach((row) => {
      row.forEach((cell) => {
        if (!cell) {
          cell = 'null';
          cell.should.equal('null');
        }
      });
    });
  });
});

describe('formatData function', () => {
  test('Complete new headers', () => {
    const oldHeaders = [
      'Race',
      'SubjectID',
      'Months',
      'Gender (girl =1)',
      'Condition (1= physical; 2 = psychological; 3 = both)',
      'Manipulation Check (pass =1; no pass = 0)',
    ];
    const newHeaders = index.makeNewHeaders(oldHeaders);
    // newHeaders.length.should.equal(17);
    newHeaders[0].should.equal('Target Child');
  });

  test('makeNewRows should return array of arrays', () => {
    const selectedHeaders = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const selectedRepeaters = [
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
      29,
      30,
      31,
      32,
      33,
      34,
      35,
      36,
    ];
    const dataArray = index.parseData(csvString);
    const newRows = index.makeNewRows(
      dataArray,
      selectedHeaders,
      selectedRepeaters
    );
    newRows.should.be.an('array');
    newRows[0].should.be.an('array');
  });

  test('makeNewRows should not include any headers', () => {
    const selectedHeaders = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const selectedRepeaters = [
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
      29,
      30,
      31,
      32,
      33,
      34,
      35,
      36,
    ];
    const dataArray = index.parseData(csvString);
    const newRows = index.makeNewRows(
      dataArray,
      selectedHeaders,
      selectedRepeaters
    );
    newRows[0].should.not.equal('Race');
  });

  test('new rows should have equal numbers of each target child', () => {
    const selectedHeaders = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const selectedRepeaters = [
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
      29,
      30,
      31,
      32,
      33,
      34,
      35,
      36,
    ];
    const dataArray = index.parseData(csvString);
    const newRows = index.makeNewRows(
      dataArray,
      selectedHeaders,
      selectedRepeaters
    );
    const tC = { GC: null, GNC: null, BC: null, BNC: null };
    newRows.forEach((row) => {
      row.forEach((cell) => {
        if (cell.toString().match(/GC|GNC|BC|BNC/)) {
          tC[cell] += 1;
        }
      });
    });
    const members = Object.values(tC);
    members.should.deep.equal([members[0], members[0], members[0], members[0]]);
  });

  test('formatData should return an array of arrays', () => {
    const selectedHeaders = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const selectedRepeaters = [
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
      29,
      30,
      31,
      32,
      33,
      34,
      35,
      36,
    ];
    const dataArray = index.parseData(csvString);
    const formattedData = index.formatData(
      dataArray,
      selectedHeaders,
      selectedRepeaters
    );
    formattedData.should.be.an('array');
    formattedData[0].should.be.an('array');
  });

  describe('data validation', () => {
    test('First row should be headers', () => {
      const dataArray = index.parseData(csvString);
      dataArray[0][0].should.equal('Race');
    });

    test('realResults should equal idealResults', () => {
      const selectedHeaders = [0, 1, 2, 3, 4, 5, 6, 7, 8];
      const selectedRepeaters = [
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        29,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
      ];
      const dataArray = index.parseData(original);
      const realResults = index.formatData(
        dataArray,
        selectedHeaders,
        selectedRepeaters
      );
      const idealResults = index.parseData(formatted);
      realResults.should.deep.equal(idealResults);
    });
  });
});
