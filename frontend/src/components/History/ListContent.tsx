import FiltreRow from './FiltreRow';
import Table from './Table';
function ListContent() {
  return (
    <div className=" lg:p-4 lg:mr-5 lg:ml-5 sm:ml-7 w-full h-full">
      <FiltreRow />

      <Table />
    </div>
  );
}

export default ListContent;
