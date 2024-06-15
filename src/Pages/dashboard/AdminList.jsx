import { Button, Card, Input, Typography } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { serverUrl } from "../../api";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteOutline } from "react-icons/md";
import EditActivity from "../../Componants/EditActivity";
import ConfirmDeleteModal from "../../Componants/ConfirmDeleteModal";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { toastConfig } from "../../App";
import { useDispatch, useSelector } from "react-redux";
import { getAllActivities, getAllAdmins } from "../../Redux/AllListReducer/action";

export const AdminList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [singleActivity, setSingleActivity] = useState({});
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [searchParams, setsearchParams] = useSearchParams();
  const dispatch = useDispatch();

  const {adminList} = useSelector((state)=>{
    return {
      adminList : state.AllListReducer.adminList
    }
  })

  const toggleModalDelete = (id) => {
    setsearchParams({id})
    setIsModalOpenDelete(!isModalOpenDelete);
  };

  const handleDelete = () => {
    axios.delete(`${serverUrl}/auth/deleteuser/${searchParams.get("id")}`)
    .then((res)=>{
      if (res.status==200){
        toast.success("Admin deleted suucessfully", toastConfig);
        dispatch(getAllAdmins).then((res)=>{return true})
      } else {
        toast.error("Something went wrong", toastConfig);
      }
    }).catch((err)=>{
      console.log(err)
      toast.error(err.response.data.error, toastConfig);
    })
  };

  const toggleModal = (el) => {
    setsearchParams({id:el._id})
    setIsModalOpen(!isModalOpen);
    setSingleActivity(el);
  };

//   function getAllData(){
//    return dispatch(getAllAdmins).then((res)=>{
//     console.log(res)
//    })
//   }

//   getAllData()

console.log(adminList)

  return (
    <Card className="h-full w-full overflow-scroll mt-5 mb-24">
      <div className="flex justify-between items-center gap-5 m-3">
        {/* <div className="w-[50%]">
          <form className="flex justify-start items-center gap-5" >
            <div className="w-[50%]">
            <Input
              label="Search by domain name..."
              name="password"
              // type="search"
              required
              // value={searchResult}
              // type={showPassword ? "text" : "password"}
              // onChange={(e) => setSearchResult(e.target.value)}
            />

            </div>
            <Button type="submit" variant="">Search</Button>
            <Button type="button"  variant="" >Clear</Button>
          </form>
        </div> */}
       
      </div>
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >
               Name of admin
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >
                Email 
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              ></Typography>
            </th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              ></Typography>
            </th>
          </tr>
        </thead>
        <tbody>
          {adminList?.map((el, index) => {
            const isLast = index === adminList.length - 1;
            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

            return (
              <tr key={el._id}>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {el.firstName + " " + el.lastName}
                  </Typography>
                </td>
                <td className={`${classes} w-[700px]`}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {el.email}
                  </Typography>
                </td>

                {/* <td className={classes}>
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
                </td> */}
                <td className={classes}>
                  <Typography
                    as="a"
                    href="#"
                    variant="small"
                    color="blue-gray"
                    onClick={() => toggleModalDelete(el._id)}
                    className="text-red-500  text-[20px]"
                  >
                    <MdOutlineDeleteOutline />
                  </Typography>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* <EditActivity
        isOpen={isModalOpen}
        onClose={toggleModal}
        singleActivity={singleActivity}
        getAllData={getAllData}
      /> */}
      <ConfirmDeleteModal
        isOpen={isModalOpenDelete}
        onClose={()=>toggleModalDelete()}
        handleDelete={handleDelete}
      />
    </Card>
  );
};

export default AdminList;
