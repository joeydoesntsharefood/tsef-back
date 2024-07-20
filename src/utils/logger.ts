import moment from 'moment';
import 'colors';

const date = moment();
const format_date = date.format('HH:mm:ss').grey;

const logger = {
  info: (value: string) => {
    console.log(`${'INFO'.bgCyan.white} ${format_date} ${value}`);
  },
  error: (local: string, error: Error) => {

    console.log(`${'ERROR'.bgRed.white} ${format_date} ${local}`);
    console.log(`${'MENSAGE'.bgRed.white} ${format_date} ${error}`);
  },
};

export default logger;