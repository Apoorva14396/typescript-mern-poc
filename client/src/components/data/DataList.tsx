import Grid from '@material-ui/core/Grid';
import MaterialTable from 'material-table';
import React from 'react';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import history from '../../history';
import { connection } from '../../lib/axiosInstance';
import { tableIcons } from '../../utils/materialTableicons/tableIcons';
import { setToken } from '../../utils/setToken';
import Edit from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { useHistory } from 'react-router-dom';

const DataList = (props: any) => {
  const history = useHistory();

  const [data, setData] = React.useState([]);
  React.useEffect(() => {
    getList();
  }, []);

  const getList = () => {
    setToken();
    connection
      .get('/user/getUsers')
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log('err is', err);
      });
  };
  const deleteData = (id: any) => {
    connection
      .delete(`/user/deleteUser/${id}`)
      .then((res) => {
        if (res.status === 200) {
          getList();
        }
      })
      .catch((err) => {
        console.log('err is', err);
      });
  };
  const sweetAlertCall = (data: any) => {
    Swal.fire({
      title: `Are you sure, you want to delete ${data.firstName}?`,
      text: 'You will not be able to recover this record!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteData(data._id);
        Swal.fire('Deleted!', 'Your record has been deleted.', 'success');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your record is safe', 'error');
      }
    });
  };
  return (
    <>
      {props.userInfo.role === 'admin' ? (
        <Grid
          container
          direction='row'
          justify='center'
          alignItems='center'
          style={{
            paddingTop: '20px',
            width: '100%'
          }}
        >
          <MaterialTable
            title='Users Data'
            columns={[
              { title: 'Name', field: 'firstName' },
              { title: 'Phone Number', field: 'phone' },
              { title: 'Email', field: 'email' },
              { title: 'Address', field: 'address' }
            ]}
            options={{
              pageSize: 5,
              filtering: false,
              actionsColumnIndex: -1,
              search: true,
              emptyRowsWhenPaging: false
            }}
            icons={tableIcons}
            data={data}
            actions={[
              {
                icon: VisibilityIcon,
                tooltip: 'View User',
                onClick: (event: any, rowData: any) => {
                  history.push(`/data/view/${rowData._id}`);
                }
              },
              {
                icon: Edit,
                tooltip: 'Edit User',
                onClick: (event: any, rowData: any) => {
                  history.push(`/data/edit/${rowData._id}`);
                }
              },
              {
                icon: DeleteForeverIcon,
                tooltip: 'Delete User',
                onClick: (event: any, rowData: any) => {
                  sweetAlertCall(rowData);
                }
              }
            ]}
          />
        </Grid>
      ) : (
        <h1>You, need to be Admin to access this page!!</h1>
      )}
    </>
  );
};
const mapStateToProps = (state: any) => ({
  userInfo: state.userInfo
});

export default connect(mapStateToProps)(DataList);
