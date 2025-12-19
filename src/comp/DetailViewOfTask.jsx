import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from './axiosIntercepter';
import MainCard from '../components/MainCard';
import { Card } from 'primereact/card';

import { toast } from 'react-toastify';
import '../App.css'
import '../index.scss';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

export function DetailViewOfTask() {
  const [returnedData, setReturnedData] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)

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

  useEffect(() => {
    console.log(returnedData?.data?.task || '');

  }, [returnedData])

  const handlerFn = async (attachmentId, fileName) => {
    try {
      const res = await axiosInstance.get(
        `/attachments/download/${attachmentId}`,
        {
          responseType: 'blob', // VERY IMPORTANT
        }
      );

      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || 'download';
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <>
      <MainCard>
        <div className='detailTaskCont'>
          <div className='leftPartCont'>
            <h3>{returnedData?.data?.task?.title || ''}</h3>
            <p>{returnedData?.data?.task?.description || ''}</p>
            <div className='attachment_array'>
              {returnedData?.data?.attachments.map((file) => (
                <div className='attachmentCard' onClick={() => {
                  handlerFn(file._id, file.fileName)
                }} key={file._id}>
                  {/* {console.log('typeOf: ', typeof (file.mimeType))} */}
                  {(file.mimeType.includes('image')) ? <img className='banner_image' src={`${file.fileUrl}`} alt="image" /> : <div className='test'>{file.mimeType}</div>}

                </div>
              ))}

            </div>
          </div>
          <div className='rightPartCont'></div>
        </div>
      </MainCard>
    </>
  );
}