import { Button, Card, Input, Typography } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { serverUrl } from "../../api";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteOutline } from "react-icons/md";
import EditParticipants from "../../Componants/EditParticipants";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllParticipants, getParticipantsByName } from "../../Redux/AllListReducer/action";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";

export const Participantlist = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [singleParticipant, setSinglePartcipant] = useState({});
  const [currentPage, setCurrentPage] = useState(searchParams.get("page") || 1);
  const [limit, setLimit] = useState(searchParams.get("limit") || 10); // default limit
  const [searchResult, setSearchResult] = useState("")
  const dispatch = useDispatch();

  const toggleModal = (el) => {
    setSearchParams({ id: el._id });
    setIsModalOpen(!isModalOpen);
    setSinglePartcipant(el);
  };

  const tableHead = [
    "Name",
    "Email",
    "Type",
    "Gender",
    "Center",
    "Date of birth",
    "Address",
    "State",
    "City",
    "Pincode",
    "Emg. name",
    "Emg. relationship",
    "Created date",
    "",
    "",
    "",
  ];

  const { partcipantList,cohortList } = useSelector((state) => {
    return {
      partcipantList: state.AllListReducer.partcipantList,
      cohortList : state.AllListReducer.cohortList
    };
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    setSearchParams({ page: currentPage, limit: limit });
    dispatch(getAllParticipants(currentPage, limit)).then((res) => {
      return true;
    });
  }, [currentPage, limit]);

  const handleSearchSubmit = (e)=>{
    e.preventDefault();
    dispatch(getParticipantsByName(searchResult))
      }  


  return (
    <Card className="h-full w-full overflow-scroll mt-5 mb-24">
      <div className="flex justify-between items-center gap-5 mt-4 mr-3 ml-3">
        <div className="w-[50%]">
          <form className="flex justify-start items-center gap-5" onSubmit={handleSearchSubmit}>
            <div className="w-[50%]">
            <Input
              label="Search participant name..."
              name="password"
              // type="search"
              required
              value={searchResult}
              // type={showPassword ? "text" : "password"}
              onChange={(e) => setSearchResult(e.target.value)}
            />

            </div>
            <Button type="submit" variant="">Search</Button>
            <Button type="button" onClick={()=>{
              setSearchResult("")
             return  dispatch(getAllParticipants(currentPage, limit)).then((res) => {
                return true;
              });
            }} variant="" disabled={!searchResult}>Clear</Button>
          </form>
        </div>
        <div className="flex justify-center items-center">
          <div className="flex justify-center items-center">
            <RiArrowLeftSLine
              className={`text-lg cursor-pointer ${
                currentPage === 1 ? "text-gray-400 pointer-events-none" : ""
              }`}
              onClick={() =>
                currentPage !== 1 && handlePageChange(currentPage - 1)
              }
            />
            <span className="px-5 font-medium">{currentPage}</span>
            <RiArrowRightSLine
              className={`text-lg cursor-pointer ${
                partcipantList?.length < limit
                  ? "text-gray-400 pointer-events-none"
                  : ""
              }`}
              onClick={() =>
                partcipantList?.length >= limit &&
                handlePageChange(currentPage + 1)
              }
            />
          </div>
          <div>
            <select
              className="border px-2 py-2 rounded-md mt-3 mb-3"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
            >
              <option value="5">5 per page</option>
              <option value="10">10 per page</option>
              <option value="15">15 per page</option>
              <option value="20">20 per page</option>
            </select>
          </div>
        </div>
      </div>
      {
        partcipantList.length == 0 ? <div className="text-center m-5">No result found !!</div>
       : <table className="w-full min-w-max table-auto text-left">
       <thead>
         <tr>
           {tableHead.map((head) => (
             <th
               key={head}
               className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
             >
               <Typography
                 variant="small"
                 color="blue-gray"
                 className="font-normal leading-none opacity-70"
               >
                 {head}
               </Typography>
             </th>
           ))}
         </tr>
       </thead>
       <tbody>
         {partcipantList?.map((el, index) => {
           const isLast = index === partcipantList.length - 1;
           const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

           return (
             <tr key={el._id}>
               <td className={classes}>
                <Typography
                   variant="small"
                   color="blue-gray"
                   className="font-normal"
                 >
                   {el.name || "-"}
                 </Typography>
               </td>
               <td className={classes}>
                 <Typography
                   variant="small"
                   color="blue-gray"
                   className="font-normal"
                 >
                   {el.email || "-"}
                 </Typography>
               </td>
               <td className={classes}>
                 <Typography
                   variant="small"
                   color="blue-gray"
                   className="font-normal"
                 >
                   {el.participantType || "-"}
                 </Typography>
               </td>
               <td className={classes}>
                 <Typography
                   variant="small"
                   color="blue-gray"
                   className="font-normal"
                 >
                   {el.gender || "-"}
                 </Typography>
               </td>
               <td className={classes}>
                 <Typography
                   variant="small"
                   color="blue-gray"
                   className="font-normal"
                 >
                  {
                    cohortList?.map((pl)=>{
                      if (el.cohort == pl._id){
                        return pl.name || "NA"
                      }
                    })
                  }
                 </Typography>
               </td>
               <td className={classes}>
                 <Typography
                   variant="small"
                   color="blue-gray"
                   className="font-normal"
                 >
                   {el.dob.split("T")[0] || "-"}
                 </Typography>
               </td>
               <td className={classes}>
                 <Typography
                   variant="small"
                   color="blue-gray"
                   className="font-normal"
                 >
                   {el.address.addressLine.substring(0, 20).length < el.address.addressLine.length
                      ? el.address.addressLine.substring(0, 20) + "..."
                      : el.address.addressLine || "-"}
                 </Typography>
               </td>
               <td className={classes}>
                 <Typography
                   variant="small"
                   color="blue-gray"
                   className="font-normal"
                 >
                   {el.address.state || "-"}
                 </Typography>
               </td>
               <td className={classes}>
                 <Typography
                   variant="small"
                   color="blue-gray"
                   className="font-normal"
                 >
                   {el.address.city || "-"}
                 </Typography>
               </td>
               <td className={classes}>
                 <Typography
                   variant="small"
                   color="blue-gray"
                   className="font-normal"
                 >
                   {el.address.pincode || "-"}
                 </Typography>
               </td>
               <td className={classes}>
                 <Typography
                   variant="small"
                   color="blue-gray"
                   className="font-normal"
                 >
                   {el.emergencyContact.name || "-"}
                 </Typography>
               </td>
               <td className={classes}>
                 <Typography
                   variant="small"
                   color="blue-gray"
                   className="font-normal"
                 >
                   {el.emergencyContact.relationship || "-"}
                 </Typography>
               </td>
               <td className={classes}>
                 <Typography
                   variant="small"
                   color="blue-gray"
                   className="font-normal"
                 >
                   {el.createdAt.split("T")[0] || "-"}
                 </Typography>
               </td>
               {/* <td className={classes}>
               <Typography
                 as="a"
                 href="#"
                 variant="small"
                 color="blue-gray"
                 className="font-medium border w-[100px] text-center p-1 rounded-lg bg-maincolor text-white"
               >
                 See deatails
               </Typography>
             </td> */}
               <td className={classes}>
                 <Typography
                   as="a"
                   href="#"
                   variant="small"
                   color="blue-gray"
                   onClick={() => toggleModal(el)}
                   className="text-maincolor2 text-[20px]"
                 >
                   <CiEdit />
                 </Typography>
               </td>
               <td className={classes}>
                 <Typography
                   as="a"
                   href="#"
                   variant="small"
                   color="blue-gray"
                   className="text-red-500  text-[20px]"
                 >
                   <MdOutlineDeleteOutline />
                 </Typography>
                 {/* <Typography
                 as="a"
                 href="#"
                 variant="small"
                 color="blue-gray"
                 className="font-medium border w-[100px] text-center p-1 rounded-lg bg-maincolor text-white"
               >
                 See deatails
               </Typography> */}
               </td>
             </tr>
           );
         })}
       </tbody>
     </table>
      }

      <EditParticipants
        isOpen={isModalOpen}
        onClose={toggleModal}
        singleParticipant={singleParticipant}
      />
    </Card>
  );
};

export default Participantlist;
