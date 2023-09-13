import React from "react";
import TablePageBackground from "../controls/PageLayout/TablePageBackground";
import {
  LeftControls,
  RightControls,
  TableControls,
} from "../controls/PageLayout/TableControls";
import SelectStation from "../common/selectstations";
import CustomArcodion from "./accordion";

const EmployeeShifts = () => {
  return (
    <React.Fragment>
      <TablePageBackground>
        <TableControls>
          <LeftControls>
            <SelectStation
              ml={"0px"}
              oneStation={true}
              allStation={true}
              callback={() => {}}
            />
          </LeftControls>
          <RightControls>
            {/* <CreateButton
              callback={handleOpenModal}
              label={"Create new filling station"}
            /> */}
          </RightControls>
        </TableControls>

        <CustomArcodion mt={"20px"} day={"Sunday"} />
        <CustomArcodion mt={"5px"} day={"Monday"} />
        <CustomArcodion mt={"5px"} day={"Tuesday"} />
        <CustomArcodion mt={"5px"} day={"Wednesday"} />
        <CustomArcodion mt={"5px"} day={"Thursday"} />
        <CustomArcodion mt={"5px"} day={"Friday"} />
        <CustomArcodion mt={"5px"} day={"Saturday"} />
      </TablePageBackground>
    </React.Fragment>
  );
};

export default EmployeeShifts;
