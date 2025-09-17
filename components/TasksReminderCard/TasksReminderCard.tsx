"use client";

import { useState } from "react";
import css from "./TasksReminderCard.module.css";
import "izitoast/dist/css/iziToast.min.css";
import { getTasks} from "@/lib/api/clientApi";
import type { Task } from "@/types/task";
import { updateTaskById } from "@/lib/api/clientApi";
import { FiPlusCircle } from "react-icons/fi";
import { FaCheck } from "react-icons/fa";
import { useAuthStore } from "@/lib/store/authStore";
import { useRouter } from "next/navigation";
import AddTaskModal from "@/components/AddTaskModal/AddTaskModal";
import AddTaskForm from "@/components/AddTaskForm/AddTaskForm";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "../Loader/Loader";



export default function TasksReminderCard() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [modalOpen, setModal] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [mutatingTasks, setMutatingTasks] = useState<Set<string>>(new Set());


  const { data, isLoading, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
    enabled: isAuthenticated,
  });

const mutation = useMutation<
  { _id: string; isDone: boolean }, 
  Error,                           
  { _id: string; isDone: boolean },
  { previousTasks?: { tasks: Task[] } } 
>({
  mutationFn: async ({ _id, isDone }) => {
    await updateTaskById(_id, { isDone });
    return { _id, isDone };
  },
  onMutate: async ({ _id, isDone }) => {
  await queryClient.cancelQueries({ queryKey: ["tasks"] });

  const previousTasks = queryClient.getQueryData<{ tasks: Task[] }>(["tasks"]);

  if (previousTasks) {
    queryClient.setQueryData(["tasks"], {
      tasks: previousTasks.tasks.map(task =>
        task._id === _id ? { ...task, isDone } : task
      )
    });
  }
  setMutatingTasks(prev => new Set(prev).add(_id));
  return { previousTasks };
},
  onError: (_err, _variables, context) => {
    import("izitoast").then((iziToast) => {
      iziToast.default.error({
        title: "Error",
        message: "Error while completing the task",
      });
    });

    if (context?.previousTasks) {
      queryClient.setQueryData(["tasks"], context.previousTasks);
    }
  },
onSettled: (_data, _error, variables) => {
  queryClient.invalidateQueries({ queryKey: ["tasks"] });

  setMutatingTasks(prev => {
    const copy = new Set(prev);
    copy.delete(variables._id);
    return copy;
  });
},
});


const onCheck = (_id: string, isDoneObj: { isDone: boolean }) => {
  mutation.mutate({ _id, isDone: isDoneObj.isDone });
};


  const handleCloseModal = () => {
    setModal(false);
  }

    const onClick = () => {
      if (isAuthenticated) {
        setModal(true);
      } else {
        router.push("/auth/register");
      }
    };

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); 
  return `${day}.${month}`;
};

  
   const today = new Date();
  today.setHours(0, 0, 0, 0);
  
const todayTasks = data?.tasks.filter((task) => {
  const taskDate = new Date(task.date);
  taskDate.setHours(0, 0, 0, 0);
  return taskDate.getTime() === today.getTime();
}) || [];

const futureTasks = data?.tasks.filter((task) => {
  const taskDate = new Date(task.date);
  taskDate.setHours(0, 0, 0, 0);
  return taskDate.getTime() > today.getTime();
}) || [];


  
    return (
      <div className={css.tasksReminderCard}>
        <div className={css.titleWrapper}>
          <h2 className={css.title}>Важливі завдання </h2>
          <button type="button" className={css.addButton} onClick={onClick}>
            <FiPlusCircle className="addButtonIcon" size={22} />{" "}
          </button>
        </div>
        <ul className={css.taskList}>
          {isLoading && <Loader />}
          {error && <h3> Не вдалось завантажити завдання!</h3>}
            {todayTasks.length > 0 && (
    <>
      <h3 className={css.sectionTitle}>Сьогодні:</h3>
      {todayTasks.map(({ _id, name, date, isDone }) => (
        <li key={_id}>
          <div className={css.dateWrapper}>{formatDate(date)}</div>

          <label className={css.taskLabel}>
            <div className={`${css.customCheckbox} ${isDone ? css.customCheckboxChecked : ""}`}>
              <FaCheck
                className={css.checkIcon}
                size={12}
                fill={isDone ? "#FFFFFF" : "transparent"}
              />
            </div>

              <input
                className={css.taskCheck}
                type="checkbox"
                checked={isDone}
                disabled={mutatingTasks.has(_id)}
                onChange={() => onCheck(_id, { isDone: !isDone })}
              />

            <span className={`${css.taskName} ${isDone ? css.taskNameChecked : ""}`}>
              {name}
            </span>

          </label>
        </li>
      ))}
    </>
  )}

  {futureTasks.length > 0 && (
    <>
      <h3 className={css.sectionTitle}>Найближчий тиждень:</h3>
      {futureTasks.map(({ _id, name, date, isDone }) => (
        <li key={_id}>
          <div className={css.dateWrapper}>{formatDate(date)}</div>

          <label className={css.taskLabel}>
            <div className={`${css.customCheckbox} ${isDone ? css.customCheckboxChecked : ""}`}>
              <FaCheck
                className={css.checkIcon}
                size={12}
                fill={isDone ? "#FFFFFF" : "transparent"}
              />
            </div>

              <input
                className={css.taskCheck}
                type="checkbox"
                checked={isDone}
                disabled={mutatingTasks.has(_id)}
                onChange={() => onCheck(_id, { isDone: !isDone })}
              />

            <span className={`${css.taskName} ${isDone ? css.taskNameChecked : ""}`}>
              {name}
            </span>

          </label>
        </li>
      ))}
    </>
  )}

  {!isLoading && !error && todayTasks.length === 0 && futureTasks.length === 0 && (
    <li>
      <h2 className={css.noTasksTitle}>Наразі немає жодних завдань</h2>
      <p className={css.noTasksText}>Створіть мершій нове завдання!</p>
      <button type="button" className={css.noTasksButton} onClick={onClick}>
        Створити завдання
      </button>
    </li>
  )}
        </ul>
        {modalOpen && (
          <AddTaskModal onClose={handleCloseModal}>
            <AddTaskForm onCloseModal={handleCloseModal} />
          </AddTaskModal>
        )}
      </div>
    );
  };

