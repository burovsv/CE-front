export const workTableToExcelFormat = (rows) => {
  let tableData = {};

  rows?.forEach((itemRow, indexRow) => {
    const cellsRow = itemRow.querySelectorAll('td');
    tableData[indexRow] = [];
    if (indexRow == 0 || indexRow == 1 || indexRow == rows?.length - 1 || indexRow == rows?.length - 2 || indexRow == rows?.length - 3 || cellsRow[0].innerText == 'Кол-во в смену') {
      let width;
      cellsRow?.forEach((itemCell, indexCell) => {
        if (indexRow == 0 || indexRow == rows?.length - 1 || indexRow == rows?.length - 2 || indexRow == rows?.length - 3 || cellsRow[0].innerText == 'Кол-во в смену') {
          if (indexRow == 0) {
            width = cellsRow?.length - 1 == indexCell ? 4 : 2;
          } else {
            width = indexCell == 0 ? 2 : cellsRow?.length - 1 == indexCell ? 4 : 2;
          }
        } else if (indexRow == 1) {
          width = indexCell == 0 || indexCell == 1 || cellsRow?.length - 1 == indexCell || cellsRow?.length - 2 == indexCell || cellsRow?.length - 3 == indexCell || cellsRow?.length - 4 == indexCell ? 1 : 2;
        }
        tableData[indexRow].push({ width, value: itemCell.innerText });
      });
    } else {
      cellsRow?.forEach((itemCell, indexCell) => {
        let value;
        let width;
        if (indexCell == 0 || indexCell == 1 || cellsRow?.length - 1 == indexCell || cellsRow?.length - 2 == indexCell || cellsRow?.length - 3 == indexCell || cellsRow?.length - 4 == indexCell) {
          width = 1;
        } else {
          width = 2;
        }
        if (itemCell?.querySelector('div > div')?.classList?.contains('work-calendar-full-cell-day-work')) {
          const workTime = itemCell?.querySelectorAll('.work-calendar-full-cell-day-work div');
          value = [];
          value[0] = workTime[0].innerText;
          value[1] = workTime[1].innerText;
          value[2] = workTime[2].innerText;
        } else if (cellsRow?.length - 4 == indexCell) {
          value = [];
          value[0] = itemCell.querySelector('div > div').innerText;

          value[1] = itemCell.querySelector('div div:nth-child(2)').innerText;
        } else {
          value = itemCell.innerText;
        }

        let cellTable = { ...(cellsRow?.length - 4 == indexCell && { type: 'hours' }), ...(itemCell?.querySelector('div > div')?.classList?.contains('work-calendar-full-cell-day-work') && { type: 'work' }), height: 1, width, value };

        if (itemCell?.querySelector('.work-calendar-full-cell-timetable')) {
          cellTable.timeTable = itemCell?.querySelector('.work-calendar-full-cell-timetable').innerText;
        }

        tableData[indexRow].push(cellTable);
      });
    }
  });
  //   console.log(tableData);
  return tableData;
};
