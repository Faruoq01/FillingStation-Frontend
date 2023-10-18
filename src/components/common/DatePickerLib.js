import {
  Button,
  CalendarCell,
  CalendarGrid,
  DateRangePicker,
  Dialog,
  Group,
  Heading,
  Popover,
  RangeCalendar,
} from "react-aria-components";
import "../../styles/common/arialdate.scss";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import React, { useCallback, useEffect } from "react";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { dateRange } from "../../storage/dashboard";

const DateRangeLib = ({ sales = false, mt = "0px", disabled = false }) => {
  const dispatch = useDispatch();
  const today = moment().format("YYYY-MM-DD").split(" ")[0];
  let formatter = useDateFormatter({ dateStyle: "long" });
  const updatedDate = useSelector((state) => state.dashboard.dateRange);

  let [range, setRange] = React.useState({
    start: parseDate(today),
    end: parseDate(today),
  });

  console.log(range, "date range");

  const setDateRange = useCallback((updatedDate) => {
    const initiateDate = {
      start: parseDate(updatedDate[0]),
      end: parseDate(updatedDate[1]),
    };
    setRange(initiateDate);
  }, []);

  useEffect(() => {
    setDateRange(updatedDate);
  }, [setDateRange, updatedDate]);

  const getDateRange = (data) => {
    const start = data.start;
    const end = data.end;

    let startDate = `${start.year}-${start.month}-${start.day}`;
    let endDate = `${end.year}-${end.month}-${end.day}`;

    startDate = moment(startDate).format("YYYY-MM-DD").split(" ")[0];
    endDate = sales
      ? startDate
      : moment(endDate).format("YYYY-MM-DD").split(" ")[0];

    dispatch(dateRange([startDate, endDate]));

    const constructDate = {
      start: parseDate(startDate),
      end: parseDate(endDate),
    };
    setRange(constructDate);
  };

  return (
    <div style={{ marginTop: mt }}>
      <DateRangePicker disabled={true} value={range} onChange={getDateRange}>
        <Group>
          <div className="date-format-text">
            {range
              ? formatter.formatRange(
                  range.start.toDate(getLocalTimeZone()),
                  range.end.toDate(getLocalTimeZone())
                )
              : "--"}
          </div>
          {disabled && <InsertInvitationIcon sx={icon} />}
          {disabled || (
            <Button>
              <InsertInvitationIcon sx={icon} />
            </Button>
          )}
        </Group>
        <Popover>
          <Dialog>
            <RangeCalendar>
              <header>
                <Button slot="previous">◀</Button>
                <Heading />
                <Button slot="next">▶</Button>
              </header>
              <CalendarGrid>
                {(date) => <CalendarCell date={date} />}
              </CalendarGrid>
            </RangeCalendar>
          </Dialog>
        </Popover>
      </DateRangePicker>
    </div>
  );
};

const icon = {
  width: "20px",
  height: "20px",
  color: "#fff",
  mr: 1,
};

export default DateRangeLib;
