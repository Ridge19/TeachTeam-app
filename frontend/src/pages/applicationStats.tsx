// imports
import React, { useEffect, useRef, useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { PieChart } from "../components/PieChart";
import { APPLICATIONS } from "@/types/applications";
import { COURSES } from "@/types/courses";

// fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// this is the applicationstates page. responsible for displaying the application statistics and the pie chart
// it uses the PieChart component to display the pie chart and the applications data to display the statistics. 
// it also uses the Chakra UI library to display the statistics in a responsive way.
// it does calculations based on the selectedCandidates array and the finalSelectedCandidates array to display the statistics.
const ApplicationStats = () => {
  const router = useRouter();
  const chartRef = useRef<HTMLCanvasElement>(null);
  const tooltipRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<PieChart | null>(null);

  const [courseStats, setCourseStats] = useState<{ courseCode: string; count: number; avgRank: number }[]>([]);
  const [finalSelectedCandidates, setFinalSelectedCandidates] = useState<any[]>([]);
  const [mostApplicantsCourse, setMostApplicantsCourse] = useState<{ courseCode: string; total: number }>({ courseCode: "", total: 0 });

  // Load final selected candidates from localStorage
  useEffect(() => {
    const storedFinal = JSON.parse(localStorage.getItem("finalSelectedCandidates") || "[]");
    setFinalSelectedCandidates(storedFinal);
  }, []);

  // Calculate stats and render pie chart when finalSelectedCandidates changes
  useEffect(() => {
    if (finalSelectedCandidates.length === 0) return;

    // Pie chart
    if (chartRef.current && tooltipRef.current) {
      if (!chartInstance.current) {
        chartInstance.current = new PieChart(chartRef.current, tooltipRef.current);
      }
      chartInstance.current.setDataFromApplications(
        finalSelectedCandidates,
        [],
        finalSelectedCandidates
      );
    }

    // Course stats
    const courseMap: { [key: string]: { total: number; totalRank: number } } = {};
    finalSelectedCandidates.forEach((cand: any) => {
      if (!courseMap[cand.courseCode]) {
        courseMap[cand.courseCode] = { total: 0, totalRank: 0 };
      }
      courseMap[cand.courseCode].total += 1;
      const rank = cand.rank ? parseFloat(cand.rank) : 0;
      courseMap[cand.courseCode].totalRank += rank;
    });

    // Find the course with the most applicants
    const mostApplicantsCourse = Object.entries(courseMap).reduce(
      (max, [courseCode, { total }]) => (total > max.total ? { courseCode, total } : max),
      { courseCode: "", total: 0 }
    );
    setMostApplicantsCourse(mostApplicantsCourse);

    // Calculate the average rank for each course
    const stats = Object.entries(courseMap).map(([courseCode, { total, totalRank }]) => ({
      courseCode,
      count: total,
      avgRank: total ? parseFloat((totalRank / total).toFixed(2)) : 0,
    }));
    setCourseStats(stats);
  }, [finalSelectedCandidates]);

  return (
    <div className="container">
      <Header />
      <main className="main-content">
        {finalSelectedCandidates.length === 0 ? (
          <Box textAlign="center" mt={20}>
            <Text fontSize="2xl" color="gray.500">No selected users</Text>
            <Text fontSize="md" color="gray.600" mb={4}>No data available for final selected candidates.</Text>
            <button className="back-button-stats" onClick={() => router.push("/Lecturer")}>Back to Dashboard</button>
          </Box>
        ) : (
          <>
            <Box textAlign="center" mb={10}>
              <Text fontSize="md" color="gray.600" mb={2}>
                Overview of all final selected applicants
              </Text>
              <Flex justify="center" mb={8}>
                <Box>
                  <Text fontSize="xl" fontWeight="bold">Total Final Selected</Text>
                  <Text fontSize="3xl">{finalSelectedCandidates.length}</Text>
                  <button className="back-button-stats" onClick={() => router.push("/Lecturer")}>Back to Dashboard</button>
                </Box>
              </Flex>
              <Box mb={6}>
                <Text fontSize="xl" fontWeight="bold">Course with Most Final Selections</Text>
                <Text fontSize="lg">{mostApplicantsCourse.courseCode} - {mostApplicantsCourse.total} applicants</Text>
              </Box>
              <Flex justify="center" flexWrap="wrap" gap={8}>
                {courseStats.map((course) => (
                  <Box
                    key={course.courseCode}
                    p={4}
                    borderWidth="1px"
                    borderRadius="md"
                    background="gray.50"
                    minWidth="200px"
                    textAlign="center"
                  >
                    <Text fontSize="lg" fontWeight="bold">{course.courseCode}</Text>
                    <Text>{course.count} final selected</Text>
                    <Text>Avg. Rank: {course.avgRank}</Text>
                  </Box>
                ))}
              </Flex>
            </Box>
            <Box className="selection-chart-wrapper">
              <Text fontSize="xl" fontWeight="semibold" mb={4}>Visual Breakdown</Text>
              {/* pie chart */}
              {finalSelectedCandidates.length > 0 ? (
                <canvas
                  ref={chartRef}
                  width={400}
                  height={400}
                  style={{ border: "1px solid #ccc" }}
                ></canvas>
              ) : (
                <Text color="gray.500">No data to display.</Text>
              )}
              <canvas
                ref={tooltipRef}
                width={150}
                height={30}
                style={{
                  position: "absolute",
                  display: "none",
                  pointerEvents: "none",
                }}
              ></canvas>
            </Box>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ApplicationStats;