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
import { parseDate } from "@internationalized/date";
import React, { useCallback, useEffect } from "react";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { dateRange } from "../../storage/dashboard";

const DateRangeLib = ({ sales = false, mt = "0px", disabled = false }) => {
  const dispatch = useDispatch();
  const today = moment().format("YYYY-MM-DD").split(" ")[0];
  const updatedDate = useSelector((state) => state.dashboard.dateRange);

  let [range, setRange] = React.useState({
    start: parseDate(today),
    end: parseDate(today),
  });

  const setDateRange = useCallback((updatedDate) => {
    const initiateDate = {
      start: parseDate(updatedDate[0]),
      end: parseDate(updatedDate[1]),
    };
    const initiateSalesDate = {
      start: parseDate(updatedDate[0]),
      end: parseDate(updatedDate[0]),
    };
    if (sales) {
      setRange(initiateSalesDate);
    } else {
      setRange(initiateDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setDateRange(updatedDate);
  }, [setDateRange, updatedDate]);

  const getFormat = (day) => {
    if (day.toString().length === 1) {
      return `0${day}`;
    }
    return day.toString();
  };

  const getDateRange = (data) => {
    const start = data.start;
    const end = data.end;

    let startDate = `${start.year}-${getFormat(start.month)}-${getFormat(
      start.day
    )}`;
    let endDate = `${end.year}-${getFormat(end.month)}-${getFormat(end.day)}`;

    const startMoment = moment(startDate).format("YYYY-MM-DD");
    const endMoment = sales
      ? startMoment
      : moment(endDate).format("YYYY-MM-DD");

    dispatch(dateRange([startDate, endDate]));

    const constructDate = {
      start: parseDate(startMoment),
      end: parseDate(endMoment),
    };
    setRange(constructDate);
  };

  const dateFormat = (date) => {
    const start = moment(date[0]).format("D MMM");
    const end = moment(date[1]).format("D MMM, YYYY");

    if (date[0] === date[1]) {
      return end;
    }
    return start.concat(" - ", end);
  };

  return (
    <div style={{ marginTop: mt }}>
      <DateRangePicker disabled={true} value={range} onChange={getDateRange}>
        <Group>
          <div className="date-format-text">{dateFormat(updatedDate)}</div>
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
