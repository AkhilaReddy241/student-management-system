import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function StudentChart({ students }) {
  const cse = students.filter(
    (s) => s.department.toLowerCase() === "cse"
  ).length;

  const ece = students.filter(
    (s) => s.department.toLowerCase() === "ece"
  ).length;

  const it = students.filter(
    (s) => s.department.toLowerCase() === "it"
  ).length;

  const eee = students.filter(
    (s) => s.department.toLowerCase() === "eee"
  ).length;

  const mech = students.filter(
    (s) => s.department.toLowerCase() === "mech"
  ).length;

  const data = {
    labels: ["CSE", "ECE", "IT", "EEE", "MECH"],
    datasets: [
      {
        label: "Students",
        data: [cse, ece, it, eee, mech],
     backgroundColor: [
  "#8B5CF6", // Purple
  "#3B82F6", // Blue
  "#EC4899", // Pink
  "#F97316", // Orange
  "#F59E0B", // Amber
],
      },
    ],
  };

  const pieData = {
    labels: ["CSE", "ECE", "IT", "EEE", "MECH"],
    datasets: [
      {
        data: [cse, ece, it, eee, mech],
       backgroundColor: [
  "#8B5CF6", // Purple
  "#3B82F6", // Blue
  "#EC4899", // Pink
  "#F97316", // Orange
  "#F59E0B", // Amber
],
      },
    ],
  };

  return (
    <div className="container mt-5">
      <h3 className="text-center mb-4">
        Student Analytics
      </h3>

      <div className="row">
        <div className="col-md-6">
          <Bar data={data} />
        </div>

        <div className="col-md-6">
          <Pie data={pieData} />
        </div>
      </div>
    </div>
  );
}

export default StudentChart;