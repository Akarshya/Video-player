import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addAnnotation, editAnnotation, deleteAnnotation } from '../store/actions';
import { CiCirclePlus } from "react-icons/ci";
import { formatTime } from "../utils/formatTime";
import { formattedDate } from "../utils/formattedDate";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Annotations = ({ videoId, jumpToTimestamp }) => {
  const videoAnnotations = useSelector(state => state.videos[videoId]?.annotations || []);
  const currentTime = useSelector(state => state.currentTime[videoId] || 0);
  const dispatch = useDispatch();
  const [note, setNote] = useState('');
  const [editing, setEditing] = useState(null);
  const currentDate = new Date().toISOString();
  const [editedNote, setEditedNote] = useState('');

  const handleAddNote = () => {
    if (editing !== null) {
      dispatch(editAnnotation(videoId, editing, editedNote));
      setEditing(null);
    } else {
      dispatch(addAnnotation(videoId, { timestamp: currentTime, note, date: currentDate }));
    }
    setNote('');
    setEditedNote('');
  };

  const handleEdit = (id, note) => {
    setEditing(id);
    setEditedNote(note);
  };

  const handleDelete = (id) => {
    dispatch(deleteAnnotation(videoId, id));
  };

  const handleEditNote = (id) => {
    dispatch(editAnnotation(videoId, id, editedNote));
    setEditing(null);
  };
  return (
    <div className="mt-4 border border-gray-300 w-full rounded-lg">
      <div className="flex items-center justify-between mb-4 px-5">
        <div>
          <p className='font-bold'>My notes</p>
          <p className='text-gray-600 text-sm'>
            All your notes at a single place. Click on any note to go to a specific timestamp in the video.
          </p>
        </div>
      </div>
      <div className="flex items-center">
        <ReactQuill
          value={note}
          onChange={setNote}
          className="border border-gray-300 mx-8 p-2 rounded-lg flex-grow"
          placeholder={`Add your note`}
        />
        <button
          onClick={handleAddNote}
          className="border border-gray-600 p-2 rounded-lg mt-2 font-bold"
        >
          <span className="flex items-center">
            <CiCirclePlus className='mr-2' /> Add new note
          </span>
        </button>
      </div>
      <ul className="mt-4 space-y-2">
        {videoAnnotations.map((annotation) => (
          <li key={annotation.id} className="flex items-start space-x-2"  onClick={() => jumpToTimestamp(annotation.timestamp)}>
            <div>
              <div>{formattedDate(annotation.date)}</div>
              {editing === annotation.id ? (
                <ReactQuill
                  value={editedNote}
                  onChange={setEditedNote}
                  className="border border-gray-300 p-2 rounded-lg flex-grow"
                  
                />
              ) : (
                <div
                
                  className="cursor-pointer text-sm"
                  dangerouslySetInnerHTML={{ __html: `${formatTime(annotation.timestamp.toFixed(2))}: ${annotation.note}` }}
                />
              )}
            </div>
            <div className="flex-grow"></div>
            <div>
              {editing === annotation.id ? (
                <button
                  onClick={() => handleEditNote(annotation.id)}
                  className="border border-gray-400 px-5 rounded py-1"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => handleEdit(annotation.id, annotation.note)}
                  className="border border-gray-400 px-5 rounded py-1"
                >
                  Edit note
                </button>
              )}
              <button
                onClick={() => handleDelete(annotation.id)}
                className="border border-gray-400 px-5 rounded py-1 ml-2"
              >
                Delete note
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Annotations;

