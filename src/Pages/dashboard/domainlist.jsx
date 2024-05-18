import { Card, Typography } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { serverUrl } from "../../api";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { Link, useSearchParams } from "react-router-dom";

export const Domainlist = () => {
  const [domainList, setDomainList] = useState([]);
  const [serachParams, setSearchParams] = useSearchParams();
  const [categoryFilter, setCategoryFilter] = useState(serachParams.get("category") || "All");

  useEffect(() => {
    axios.get(`${serverUrl}/domain/all/?category=${categoryFilter}`).then((res) => {
      setDomainList(res.data.message);
    });
    setSearchParams({category:categoryFilter})
  }, [categoryFilter]);

  return (
    <div>
      <div className=" flex justify-end items-center">
      <select name="" id="" value={categoryFilter} className="border w-[30%] px-2 py-2 rounded-md mt-3 mb-3" onChange={(e)=>setCategoryFilter(e.target.value)}>
        <option value="All">All domains</option>
        <option value="General">General</option>
        <option value="Special Need">Special Need</option>
      </select>
      </div>


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
                Domain name
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >
                Category
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >
                Total subtopics
              </Typography>
            </th>

            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >
               All subtopics
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
          {domainList?.map(({ name, category, subTopics,_id }, index) => {
            const isLast = index === domainList.length - 1;
            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

            return (
              <tr key={name}>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {name}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {category || "-"}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {subTopics.length || "-"}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {subTopics?.map((el,index) => {
                      return <div>{index + 1}. {el.content}</div>
                    })}
                  </Typography>
                </td>
              <td className={classes}>
               <Link to={`/mainpage/edit-domain/${_id}`}><Typography
                  as="a"
                  variant="small"
                  color="blue-gray"
                  className="text-maincolor2 text-[20px] "
                >
              <CiEdit />
                </Typography></Link> 
              </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
    </div>
  );
};

export default Domainlist;
