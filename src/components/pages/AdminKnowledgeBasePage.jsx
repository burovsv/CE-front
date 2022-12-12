import React, { useEffect, useState } from 'react';
import Table from '../Table';


const AdminKnowledgeBasePage = () => {


    const header = [
        {
          title: 'Дата',
          prop: 'dateStart',
          onChange: (val) => {
            // return moment(val).format('DD.MM.YYYY');
          },
        },
        {
          title: 'Статья',
          prop: 'dateEnd',
          onChange: (val) => {
            // return moment(val).format('DD.MM.YYYY');
          },
        },
        { title: 'Раздел', prop: 'name', order: 2 },
    
        {
          title: 'Группа',
          onChange: (val) => {
            // return val?.categories?.map((cat) => <div>{cat?.name}</div>);
          },
        },
      ];

    let element = (
        <div>
          <Table
            // pages={testingCount}
            // loading={loading}
            header={header}
            // data={viewData}
            // onMore={() => setParamsData({ page: paramsData?.page + 1, search: paramsData?.search })}
            // onAdd={() => dispatch(setActiveModal('modal-testing'))}
            addBtnText="Добавить"
            // subText={testingSuccess && 'Новость добавлена'}
            // onSearch={(term) => setParamsData({ page: 1, search: term })}
            // onEdit={(val) => {
            //   dispatch(setActiveModal('modal-testing'));
            //   dispatch(getAdminTestingSingle({ id: val?.id }));
            // }}
            // onDelete={(val) => dispatch(deleteTesting({ testingId: val?.id }))}
          />
          {/* {activeModal === 'modal-testing' && <ModalTesting />} */}
          {/* {(createTestingLoading || deleteTestingLoading || updateTestingLoading) && <Loading overlay />} */}
        </div>
      );
    return element;
}

export default AdminKnowledgeBasePage;