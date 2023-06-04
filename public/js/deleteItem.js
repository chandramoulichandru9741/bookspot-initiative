const deleteBtn = document.querySelectorAll('#deletebtn');

const deleteItem = (model, itemId) => {
  axios({
    method: 'delete',
    url: `/api/v1/${model}/${itemId}`,
  })
    .then((res) => {
      if (res.data.status === 'success') {
        location.reload(true);
      }
    })
    .catch((e) => {
      console.log(e.response.data.msg);
    });
};

deleteBtn.forEach((ele) =>
  ele.addEventListener('click', (e) => {
    e.preventDefault();
    const { model, itemId } = e.target.dataset;
    swal({
      title: 'Are you sure',
      text: 'You may want to delete',
      icon: 'warning',
      buttons: true,
    }).then((willDelete) => {
      if (willDelete) {
        deleteItem(model, itemId);
        swal('The product has been removed ', {
          icon: 'success',
        });
      }
    });
  })
);
