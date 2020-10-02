const msg = document.getElementById('msg');
const subMsg = document.getElementById('sub-msg');
const filePicker = document.getElementById('file-picker');
const fileContainer = document.getElementById('file-container');
// const repeatCount = document.getElementById('repeat-count');
const submitBtn = document.getElementById('submit-btn');
const formatBtn = document.getElementById('format-btn');
const continueBtn = document.getElementById('continue-btn');
const formatContainer = document.getElementById('format-container');
const displayFilename = document.getElementById('filename');
const outputTable = document.getElementById('output');
const exportBtn = document.getElementById('export-btn');
const restartBtn = document.getElementById('restart-btn');

// const msg1 = 'Step 1: Choose a .csv file';
// const subMsg1 =
// 'Cells must separated by commas, and rows separated by linebreaks. Remove all commas from cells before exporting csv.';
const msg2 = 'Step 2: Select columns to keep AS-IS';
const subMsg2 =
  'These will be kept as-is, in the original order. (They will not be reformatted).\nShift-click to select multiple in a row. Click again to de-select. Continue when done.';
const msg3 = 'Step 3: Select repeating columns to be reformatted.';
const subMsg3 = 'Shift-click to select multiple in a row. Click again to de-select. Format when ready!';
const msg4 = 'Formatting complete!';
const subMsg4 =
  'Review the table below for obvious errors. Click headers to rename.\nExport a new csv file when ready.';

let filename = '';
let selectedHeaders = [];
let selectedRepeaters = [];
let prevSelection = null;
// let sortOrder = [];
let parsedData = [];
let output = [];

document.addEventListener('DOMContentLoaded', () => {
  submitBtn.addEventListener('click', async () => {
    if (filePicker.files[0]) {
      const input = getInput();
      displayFilename.innerText = input.name;
      filename = makeFilename(input);
      parsedData = await processInput(input);
      displayOutput([parsedData[0]], selectedHeaders, true);
      fileContainer.classList.add('hidden');
      formatContainer.classList.remove('hidden');
      msg.innerText = msg2;
      subMsg.innerText = subMsg2;
    }
  });

  continueBtn.addEventListener('click', (e) => {
    if (
      confirm(
        'You selected ' +
          selectedHeaders.length +
          ' columns to keep unchanged in the new file. Is that correct?'
      )
    ) {
      continueBtn.classList.add('hidden');
      formatBtn.classList.remove('hidden');
      msg.innerText = msg3;
      subMsg.innerText = subMsg3;
      clearTable();
      displayOutput([parsedData[0]], selectedRepeaters, true);
    }
  });

  formatBtn.addEventListener('click', () => {
    if (
      confirm(
        'You selected ' +
          selectedRepeaters.length +
          ' columns to REFORMAT in the new file. Is that correct?'
      )
    ) {
      msg.innerText = 'Formatting... (This may take a while)';
      subMsg.innerText = '';
      formatContainer.classList.toggle('hidden');
      exportBtn.classList.toggle('hidden');
      clearTable();
      output = formatData(parsedData, selectedHeaders, selectedRepeaters);
      msg.innerText = msg4;
      subMsg.innerText = subMsg4;
      displayFilename.innerText = 'NEW FILENAME: ' + filename;
      displayOutput(output, 'rename', true);
      prepareExport(output);
    }
  });

  restartBtn.addEventListener('click', () => {
    filePicker.value = '';
    location.reload();
  });
});

function getInput() {
  const file = filePicker.files[0];
  // const n = parseInt(repeatCount.value);
  return file;
}

function makeFilename(input) {
  return (
    input.name.slice(0, input.name.lastIndexOf('.')) +
    '-formatted' +
    input.name.slice(input.name.lastIndexOf('.'))
  );
}

async function processInput(input) {
  try {
    const dirtyData = await readInput(input);
    const cleanData = sanitizeData(dirtyData);
    const parsedData = parseData(cleanData);
    return parsedData;
  } catch (err) {
    console.log('error:', err);
  }
}

async function readInput(input) {
  let csv = {
    size: 0,
    dataFile: [],
  };

  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.readAsBinaryString(input);

    reader.onload = function (e) {
      csv.size = e.total;
      csv.dataFile = e.target.result;
      // console.log('csv.dataFile:', csv.dataFile);
      // parseData(csv.dataFile);
      resolve(csv.dataFile);
    };

    reader.onerror = function (e) {
      subMsg.innerText = 'Failed to read file!\n\n' + reader.error;
      reject;
    };
  });

  // reader.onload = function (e) {
  //   csv.size = e.total;
  //   csv.dataFile = e.target.result;
  //   console.log('csv.dataFile:', csv.dataFile);
  //   parseData(csv.dataFile);
  //   // return csv.dataFile;
  // };
  // console.log('csv:', csv);
  // console.log('csv.dataFile', csv);
}

function sanitizeData(data) {
  data = data.replace(/"/g, '');
  data = data.replace(/_/g, '-');
  return data;
}

function parseData(data) {
  let dataArray = [];
  let rows = data.split(/\n/);
  rows.forEach((row) => {
    row = row.split(',');
    row = row.map((cell) => {
      if (!cell) {
        cell = 'null';
      }
      return cell;
    });
    dataArray.push(row);
  });
  // console.log('dataArray:', dataArray);
  return dataArray;
}

function getOldHeaders(dataArray, selectedHeaders) {
  const oldHeaders = [];
  selectedHeaders.forEach((index) => {
    oldHeaders.push(dataArray[0][index]);
  });
  // console.log('oldHeaders:', oldHeaders);
  return oldHeaders;
}

function makeNewHeaders(oldHeaders) {
  const newHeaders = [
    // 'Target child',
    // 'Resp 3',
    // 'Resp 4',
    'Resp 5',
    'Resp 6',
    'Resp 7',
    'Resp 8',
    'Resp 9',
    'Resp 10',
    'Resp 12',
  ];
  return ['Target Child'].concat(oldHeaders.concat(newHeaders));
}

function makeNewRows(dataArray, selectedHeaders, selectedRepeaters) {
  // remove header row before mapping
  const originalHeaderRow = dataArray.shift(0);
  let newRows = [];
  for (let i = 0; i < 4; i++) {
    const newRow = dataArray.map((row) => {
      let tempNewRow = [];

      // Add all the basic meta info
      selectedHeaders.forEach((index) => {
        tempNewRow.push(row[index]);
      });

      // Fill in target child data
      let targetChild;
      switch (i) {
        case 0:
          targetChild = 'GC';
          break;

        case 1:
          targetChild = 'GNC';
          break;

        case 2:
          targetChild = 'BC';
          break;

        case 3:
          targetChild = 'BNC';
          break;

        default:
          break;
      }
      tempNewRow.unshift(targetChild);

      // Add repeating responses
      tempNewRow = tempNewRow.concat(getResps(row, i, selectedRepeaters));
      // console.log('tempNewRow:', tempNewRow);
      return tempNewRow;
    });
    newRows.push(newRow);
  }
  newRows = newRows.flat();

  // put the original header row back onto dataArray
  dataArray.unshift(originalHeaderRow);
  return newRows;
}

function getResps(row, i, selectedRepeaters) {
  // console.log('selectedRepeaters.length:', selectedRepeaters.length);
  const resps = [];
  for (
    let respIndex = selectedRepeaters[0] + i;
    respIndex <= selectedRepeaters.length + selectedRepeaters[0] - 1;
    respIndex += 4
  ) {
    // console.log('respIndex:', respIndex);
    resps.push(row[respIndex]);
  }
  return resps;
}

function assembleNewCsv(newHeaders, newRows) {
  newRows.unshift(newHeaders);
  return newRows;
}

function formatData(dataArray, selectedHeaders, selectedRepeaters) {
  const oldHeaders = getOldHeaders(dataArray, selectedHeaders);
  const newHeaders = makeNewHeaders(oldHeaders);
  const newRows = makeNewRows(dataArray, selectedHeaders, selectedRepeaters);
  const newCsv = assembleNewCsv(newHeaders, newRows);
  return newCsv;
}

function displayOutput(array, headerType, clickable) {
  array.forEach((row) => {
    const tableRow = outputTable.insertRow(-1);

    row.forEach((cell) => {
      const newCell = tableRow.insertCell(-1);
      newCell.innerText = cell;
      if (clickable && array.indexOf(row) === 0) {
        if (newCell.innerText === 'null') {
          newCell.style.fontStyle = 'italic';
          newCell.style.color = 'gray';
        }
        newCell.classList.add('clickable');
        newCell.classList.add('no-select');
        newCell.addEventListener('click', (e) => {
          selectColumns(e, headerType, row);
        });
      }
      newCell.classList.add('table-cell');
    });
  });
}

function clearTable() {
  outputTable.innerHTML = '';
}

function selectColumns(e, headerType, row) {
  const childEls = outputTable.firstElementChild.firstElementChild.children;
  const headerLabel = e.target.innerText;
  const headerIndex = row.indexOf(
    row.find((x) => {
      return x == headerLabel;
    })
  );

  if (headerType === 'rename') {
    const newText = prompt(`Enter new text to replace '${headerLabel}'`);
    if (newText != null) {
      row[headerIndex] = newText;
      prepareExport(output);
      childEls[headerIndex].innerText = newText;
      return;
    }
  }

  if (e.shiftKey) {
    if (headerIndex > prevSelection) {
      for (let i = prevSelection + 1; i <= headerIndex; i++) {
        recordHeader(i, true);
      }
    } else if (headerIndex < prevSelection) {
      let rangeStart = prevSelection;
      for (let i = headerIndex; i < rangeStart; i++) {
        recordHeader(i, true);
      }
    } else {
      recordHeader(headerIndex);
    }
  } else {
    recordHeader(headerIndex);
  }

  function recordHeader(index, shift) {
    prevSelection = index;

    if (childEls[index].getAttribute('selected') === 'true' && !shift) {
      headerType.splice(
        headerType.indexOf(headerType.find((x) => x === headerIndex)),
        1
      );
      childEls[index].setAttribute('selected', 'false');
      childEls[index].style.backgroundColor = '';
    } else {
      childEls[index].setAttribute('selected', 'true');
      childEls[index].style.backgroundColor = 'lightblue';

      if (headerType.find((x) => x === index) == null) {
        headerType.push(index);
        headerType.sort((a, b) => a - b);
      }
    }
  }
}

function prepareExport(output) {
  let csv = '';
  output.forEach((row) => {
    csv += row.join(',') + '\n';
  });
  csv = csv.replace(/null/g, '');
  let csvData = new Blob([csv], { type: 'text/csv' });
  let csvUrl = URL.createObjectURL(csvData);

  exportBtn.href = csvUrl;
  exportBtn.target = '_blank';
  exportBtn.download = filename;

  csv = '';
  csvData = null;
  csvUrl = '';
}

export {
  makeFilename,
  readInput,
  parseData,
  getOldHeaders,
  makeNewHeaders,
  makeNewRows,
  processInput,
  formatData,
  displayOutput,
};
