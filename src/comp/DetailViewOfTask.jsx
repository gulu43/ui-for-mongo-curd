import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from './axiosIntercepter';
import MainCard from '../components/MainCard';
import { Card } from 'primereact/card';

import '../App.css'
import '../index.scss';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

export function DetailViewOfTask() {
  const [returnedData, setReturnedData] = useState(null)
  const { id } = useParams();
  useEffect(() => {
    const gettingTaskData = async () => {
      const result = await axiosInstance.post('/gettaskdetails', { id })
      setReturnedData(result)
      console.log('task: ', result.data.task);
      console.log('attachments: ', result.data.attachments);
      console.log('members: ', result.data.members);

    }
    gettingTaskData()
  }, [id])

  return (
    <>
      <MainCard>
        <div className='detailTaskCont'>
          <div className='leftPartCont'>
            <h2>{ }</h2>
          </div>
          <div className='rightPartCont'></div>
        </div>
      </MainCard>
    </>
  );
}