import { List, ListItem, Typography } from "@material-tailwind/react";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const SeeDetailesSession = ({ isOpen, onClose, singleSession }) => {
  if (!isOpen) return null;

  const {
    partcipantList
  } = useSelector((state) => {
    return {
      partcipantList: state.AllListReducer.partcipantList,
    };
  });


  return (
    <div className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative m-4 w-2/5 min-w-[30%] max-w-[30%] max-h-[80vh] overflow-y-auto rounded-lg bg-white font-sans text-base font-light leading-relaxed text-blue-gray-500 shadow-2xl p-8">
        <div className="flex items-center font-sans text-2xl font-semibold text-blue-gray-900">
          All participants
        </div>
        <div className="mt-5">
          {singleSession?.participants?.map((el,index) => {
            return partcipantList?.map((pl)=>{
              if (pl._id == el.participantId){
                return (
                  <List key={index}>
                    <ListItem>
                      <Typography className="w-[60%] mr-5">
                        {index + 1}. {pl.name}
                      </Typography>
                    </ListItem>
                  </List>
                );
              }
            })
          })}
        </div>
        <div className="flex flex-wrap items-center justify-center p-4 text-blue-gray-500">
          <button
            onClick={onClose}
            className="px-6 py-3 mr-1 font-sans text-xs font-bold text-red-500 uppercase transition-all rounded-lg hover:bg-red-500/10 active:bg-red-500/30  border border-red-300"
          >
            Close
          </button>
          {/* <button
            onClick={onClose}
            className="rounded-lg bg-gradient-to-tr from-green-600 to-green-400 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-green-500/20 transition-all hover:shadow-lg hover:shadow-green-500/40 active:opacity-[0.85]"
          >
            Confirm
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default SeeDetailesSession;
