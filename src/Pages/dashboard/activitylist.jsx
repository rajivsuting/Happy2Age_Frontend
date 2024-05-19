import { Card, Typography } from "@material-tailwind/react";
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

export const ActivityList = () => {
  const [activityList, setActivityList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [singleActivity, setSingleActivity] = useState({});
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [searchParams, setsearchParams] = useSearchParams()
  const toggleModalDelete = (id) => {
    setsearchParams({id})
    setIsModalOpenDelete(!isModalOpenDelete);
  };

  const handleDelete = () => {
    axios.delete(`${serverUrl}/activity/delete/${searchParams.get("id")}`)
    .then((res)=>{
      if (res.status==200){
        toast.success("Activity delete suucessfully", toastConfig);
        axios.get(`${serverUrl}/activity/all`).then((res) => {
          setActivityList(res.data.message);
        });
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

  useEffect(() => {
    axios.get(`${serverUrl}/activity/all`).then((res) => {
      setActivityList(res.data.message);
    });
  }, []);
  return (
    <Card className="h-full w-full overflow-scroll mt-5 mb-24">
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >
                Activity name
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >
                Description
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
          {activityList?.map((el, index) => {
            const isLast = index === activityList.length - 1;
            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

            return (
              <tr key={el.name}>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {el.name || "-"}
                  </Typography>
                </td>
                <td className={`${classes} w-[700px]`}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {el.description}
                  </Typography>
                </td>

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
      <EditActivity
        isOpen={isModalOpen}
        onClose={toggleModal}
        singleActivity={singleActivity}
      />
      <ConfirmDeleteModal
        isOpen={isModalOpenDelete}
        onClose={toggleModalDelete}
        handleDelete={handleDelete}
      />
    </Card>
  );
};

export default ActivityList;
