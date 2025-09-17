import { MomData } from "@/lib/api/serverApi";
import clsx from "clsx";
import React from "react";
import css from "./Tabs.module.css";
import { ImSpoonKnife } from "react-icons/im";
import { CiDumbbell } from "react-icons/ci";
import { LiaCouchSolid } from "react-icons/lia";
import TasksReminderCard from "../TasksReminderCard/TasksReminderCard";

type Props = {
  data: MomData;
};

const MomTabContent: React.FC<Props> = ({ data }) => {
  function IconRenderer({ keyValue }: { keyValue: number }) {
    switch (keyValue) {
      case 0:
        return <ImSpoonKnife size={"24px"} />;
      case 1:
        return <CiDumbbell size={"24px"} />;
      case 2:
        return <LiaCouchSolid size={"24px"} />;
      default:
        return null;
    }
  }
  return (
    <div className={clsx(css["mom-container"])}>
      <div className={clsx(css["mom-info"])}>
        <div className={clsx(css["feel-cont"])}>
          <h3 className={clsx(css["mom-title"])}>Як ви можете почуватись</h3>
          <ul className={clsx(css["feel-list"])}>
            {data.feelings.states.map((state, idx) => (
              <li className={clsx(css["feel-item"])} key={idx}>
                {state}
              </li>
            ))}
          </ul>
          <p>{data.feelings.sensationDescr}</p>
        </div>

        <div className={clsx(css["advice-cont"])}>
          <h3 className={clsx(css["advice-title"])}>
            Поради для вашого комфорту
          </h3>
          <ul>
            {data.comfortTips.map((tip, idx) => (
              <li className={clsx(css["tips-item"])} key={idx}>
                <h4 className={clsx(css["tips-title"])}>
                  <IconRenderer keyValue={idx} /> {tip.category}
                </h4>
                <p className={clsx(css["tips-text"])}>{tip.tip}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <TasksReminderCard />
    </div>
  );
};

export default MomTabContent;
