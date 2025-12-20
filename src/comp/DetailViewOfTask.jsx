import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from './axiosIntercepter';
import MainCard from '../components/MainCard';
import { Card } from 'primereact/card';
import { Editor } from "primereact/editor";
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Fieldset } from 'primereact/fieldset';
import { Accordion, AccordionTab } from 'primereact/accordion';

// import { Button as RBButton } from 'react-bootstrap';
// import { Avatar } from '@/components/lib/avatar/Avatar';
import { toast } from 'react-toastify';
import '../App.css'
import '../index.scss';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

export function DetailViewOfTask() {

  const [selectedItem, setSelectedItem] = useState(null)
  const [returnedData, setReturnedData] = useState(null)
  const [text, setText] = useState('');
  const [files, setFiles] = useState([]);
  const [comments, setComments] = useState([]);
  const [allAttachments, setAllAttachments] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    const gettingTaskData = async () => {
      const result = await axiosInstance.post('/gettaskdetails', { id })
      setReturnedData(result)
      console.log('task: ', result.data.task);
      console.log('attachments: ', result.data.attachments);
      console.log('members: ', result.data.members);
      console.log('Result: ', result);


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

  const chooseOptions = {
    icon: 'pi pi-fw pi-images',
    iconOnly: true,
    className: 'custom-choose-btn p-button-rounded p-button-outlined'
  };

  // 2. Configure the "Cancel" button (Icon only, danger color, rounded, outlined)
  const cancelOptions = {
    icon: 'pi pi-fw pi-times',
    iconOnly: true,
    className: 'custom-cancel-btn p-button-rounded p-button-danger p-button-outlined'
  };

  // 3. Define the Header Template to arrange the buttons
  const headerTemplate = (options) => {
    const { className, chooseButton, cancelButton } = options;
    return (
      <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {chooseButton}
        {cancelButton}
      </div>
    );
  };

  const handleClick = async (e) => {
    e.preventDefault()
    const formData = new FormData()

    formData.append('taskId', id)
    formData.append('message', text)
    formData.append('commentedBy', localStorage.getItem('name'))
    if (files.length > 0) {
      files.map((file) => (
        formData.append('attachments', file)
      ))
    }

    const result = await axiosInstance.post('/addcomment', formData)
    console.log('output: ', result);

    if (result.status == 201) {
      toast.success('Comment Added')
      const allComments = await axiosInstance.post('/allcomments', { taskId: id })
      console.log('allComments', allComments.data.allcomments);
      setComments(allComments.data.allcomments)
    }

  }

  useEffect(() => {
    // console.log('comments all: ', comments);
    (async () => {
      const allComments = await axiosInstance.post('/allcomments', { taskId: id })
      console.log('allComments', allComments.data.allcomments);
      // console.log('send to attechments: ', allComments.data.allcomments[0].attachments[0].mimeType);

      const cmtFiles = allComments.data.allcomments.map((cmt) => (
        cmt.attachments.map((file) => ({
          '_id': file._id,
          'fileName': file.fileName,
          'filePath': file.filePath,
          'mimeType': file.mimeType,
          'fileExt': file.fileExt,
          'fileUrl': file.fileUrl,
          'fileSize': file.fileSize,
        }))
      ))
      // console.log('Returned data: ',returnedData);
      console.log('created data:', cmtFiles);

      // setReturnedData((prev) => ({
      //   ...prev,
      //   data: data.map(allthree => ({
      //     ...allthree,
      //     attachmentId : cmtFiles
      //   }))
      // }))
      // attachments: cmtFiles

      setComments(allComments.data.allcomments)
    })();
  }, [])

  // useEffect(() => {
  //   (async () => {
  //     const res = await axiosInstance.post('/allcomments', { taskId: id });
  //     const allComments = res.data.allcomments;

  //     setComments(allComments);

  //     const commentAttachments = allComments.flatMap(cmt =>
  //       cmt.attachments || []
  //     );

  //     const taskAttachments = returnedData?.data?.attachments || [];

  //     setAllAttachments([...taskAttachments, ...commentAttachments]);
  //   })();
  // }, [id, returnedData]);


  const renderHeader = (name) => {
    return (
      <span>
        <span className="" style={{ color: 'black' }}>By {name}</span>
      </span>
    );
  };

  return (
    <>
      <MainCard>
        <div className='detailTaskCont' >
          <div className='leftPartCont'>
            <div style={{ fontSize: '250%', color: 'black' }}>{returnedData?.data?.task?.title || ''}</div>
            <p style={{ fontSize: '150%', color: 'black' }}>{returnedData?.data?.task?.description || ''}</p>
            <Divider align="left">
              <div className="inline-flex align-items-center">
                {/* <i className="pi pi-user mr-2"></i> */}
                <b>Attechments</b>
              </div>
            </Divider>

            <div className='attachment_array'>
              {
                // (allAttachments || []).map(file => (
                //   <div
                //     className="attachmentCard"
                //     key={file._id}
                //     onClick={() => handlerFn(file._id, file.fileName)}
                //   >
                //     {file.mimeType?.includes('image') ? (
                //       <img className="banner_image" src={file.fileUrl} alt="" />
                //     ) : (
                //       <div className="test">{file.mimeType}</div>
                //     )}
                //   </div>
                // ))
                (returnedData?.data?.attachments || [
                  {
                    _id: 43,
                    filename: 'ok',
                    fileUrl: '',
                    mineType: 'No File Found'
                  }
                ]).map((file) => (
                  <div className='attachmentCard'
                    onClick={() => { handlerFn(file._id, file.fileName) }}
                    key={file._id}>
                    {
                      (file?.mimeType?.includes('image')) ?
                        <img className='banner_image' src={`${file?.fileUrl}`} alt="image" /> :
                        <div className='test'>{file?.mimeType || 'No file Found'}</div>
                    }
                  </div>

                ))
              }

            </div>
            <Divider align="left">
              <div className="inline-flex align-items-center">
                {/* <i className="pi pi-user mr-2"></i> */}
                <b>Comment</b>
              </div>
            </Divider>
            <div className="card">
              <Editor value={text} onTextChange={(e) => setText(e.htmlValue)} style={{ height: '130px' }} />
            </div>
            <div className="card">
              <FileUpload
                name="attachments"
                multiple
                customUpload
                auto={false}
                headerTemplate={headerTemplate}
                chooseOptions={chooseOptions}
                cancelOptions={cancelOptions}
                accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                maxFileSize={5 * 1024 * 1024}
                onSelect={(e) => {
                  setFiles(e.files);
                }}
                emptyTemplate={
                  <p className="m-0">
                    Drag and drop files here to attach
                  </p>
                }
              />
            </div>
            <Divider align="left">
              <Button label="Send" icon="pi pi-send" className="p-button-outlined" onClick={handleClick} />
            </Divider>

            <div className='comment-Section'>
              {(comments || []).map((cmt) => (
                <Editor key={cmt._id} className='card mb-2' value={cmt.message} readOnly headerTemplate={renderHeader(cmt.commentedBy.name)} style={{ height: 'auto' }} />

              ))}
            </div>
          </div>

          <div className='rightPartCont'>
            {/* We wrap the logic in a check to ensure data exists */}
            {returnedData?.data?.members && (
              <Accordion multiple activeIndex={[0, 1]} className="w-full">

                {/* --- Tab 1: ASSIGNEES --- */}
                <AccordionTab
                  header={`Assignees (${returnedData.data.members.filter(m => m.role === 'assignee').length})`}
                >
                  {returnedData.data.members.filter(m => m.role === 'assignee').length > 0 ? (
                    returnedData.data.members
                      .filter(member => member.role === 'assignee')
                      .map((member, index) => (
                        <div key={index} className="mb-3 p-2 surface-100 border-round" style={{ border: '1px solid var(--surface-d)' }}>
                          <div className="font-bold text-lg mb-1">{member.userId?.name || 'Unknown User'}</div>
                          <div className="text-sm text-gray-600">
                            {/* <i className="pi pi-plus-circle mr-1" style={{ fontSize: '0.8rem' }}></i> */}
                            Added by: {member.addedBy?.name}
                          </div>
                        </div>
                      ))
                  ) : (
                    <p className="m-0 text-gray-500 font-italic">No assignees yet.</p>
                  )}
                </AccordionTab>

                {/* --- Tab 2: WATCHERS --- */}
                <AccordionTab
                  header={`Watchers (${returnedData.data.members.filter(m => m.role !== 'assignee').length})`}
                >
                  {returnedData.data.members.filter(m => m.role !== 'assignee').length > 0 ? (
                    returnedData.data.members
                      .filter(member => member.role !== 'assignee')
                      .map((member, index) => (
                        <div key={index} className="mb-3 p-2 surface-100 border-round" style={{ border: '1px solid var(--surface-d)' }}>
                          <div className="font-bold text-lg mb-1">{member.userId?.name || 'Unknown User'}</div>
                          <div className="text-sm text-gray-600">
                            {/* <i className="pi pi-eye mr-1" style={{ fontSize: '0.8rem' }}></i> */}
                            Added by: {member.addedBy?.name}
                          </div>
                        </div>
                      ))
                  ) : (
                    <p className="m-0 text-gray-500 font-italic">No watchers yet.</p>
                  )}
                </AccordionTab>

              </Accordion>
            )}
          </div>

        </div>
      </MainCard>
    </>
  );
}