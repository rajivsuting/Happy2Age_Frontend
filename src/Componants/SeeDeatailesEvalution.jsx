import React from "react";
import { AiOutlineClose } from "react-icons/ai";

const SeeDetailsCohort = ({ isOpen, onClose, singleEvalustion }) => {
  if (!isOpen) return null;
console.log(singleEvalustion)
  return (
    <div className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
        <div className="relative m-4 w-[60%] max-h-[90vh] overflow-y-auto rounded-lg bg-white font-sans text-base font-light leading-relaxed text-blue-gray-500 shadow-2xl px-4">
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 py-8 font-sans text-2xl font-semibold text-blue-gray-900 bg-white">
          Evalution details
          <AiOutlineClose
            className="cursor-pointer"
            size={24}
            onClick={onClose}
          />
        </div>
        <div className="mt-5">
          <table className="min-w-full divide-y divide-gray-200">
            <tbody>
              <tr>
                <td className="py-2 font-semibold">Member name</td>
                <td>{singleEvalustion?.participant?.name || "NA"}</td>
              </tr>
              <tr>
                <td className="py-2 font-semibold">Centre</td>
                <td>{singleEvalustion?.cohort?.name || "NA"}</td>
              </tr>
              <tr>
                <td className="py-2 font-semibold">Session</td>
                <td>{singleEvalustion?.session?.name || "NA"}</td>
              </tr>
              <tr>
                <td className="py-2 font-semibold">Activity</td>
                <td>{singleEvalustion?.activity?.name || "NA"}</td>
              </tr>
              <tr>
                <td className="py-2 font-semibold">Domains</td>
                <td>
                  {singleEvalustion?.domain?.map((el, index1) => {
                    return (
                      <table
                        key={index1}
                        className="min-w-full divide-y divide-gray-200 mb-5 border-b border-t border-b-gray-300 border-t-gray-300"
                      >
                        <tbody>
                          <tr>
                            <td className="py-2 font-semibold">Domain name</td>
                            <td>{el.name || "NA"}</td>
                          </tr>
                          {el.subTopics?.map((el, index2) => {
                            return (
                              <tr key={index2}>
                                <td className="py-2 font-semibold">
                                  Question: {index2 + 1}
                                </td>
                                <td>{el.content || "NA"}</td>
                                <td className="py-2 font-semibold">Score</td>
                                <td>{el.score || "NA"}</td>
                              </tr>
                            );
                          })}
                          <tr>
                            <td className="py-2 font-semibold">Average</td>
                            <td>{el?.average || "NA"}</td>
                          </tr>
                          <tr>
                            <td className="py-2 font-semibold">Observation</td>
                            <td>{el?.observation || "NA"}</td>
                          </tr>
                        </tbody>
                      </table>
                    );
                  })}
                </td>
              </tr>
              <tr>
                <td className="py-2 font-semibold">Grand average</td>
                <td>{singleEvalustion?.grandAverage || "NA"}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className=" sticky bottom-0 z-10 flex flex-wrap items-center justify-center p-4 text-blue-gray-500">
          {/* <button
            onClick={onClose}
            className="px-6 py-3 mr-1 font-sans text-xs font-bold text-red-500 uppercase transition-all rounded-lg hover:bg-red-500/10 active:bg-red-500/30  border border-red-300"
          >
            Close
          </button> */}
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

export default SeeDetailsCohort;
