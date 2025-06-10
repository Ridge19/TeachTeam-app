// THIS PAGE DOES THE CALCULATIONS FOR THE PIE CHART, AND GETS THE DATA. ALSO 
// RENDERS THE PIE CHART

// This file contains the PieChart class which is used to render a pie chart on a canvas element.
// takes data from finalSelectedCandidates and stores it in LocalStorage after getting it from the backend (MySQL database).

// NOTHING HAS CHANGED.

import ApplicationStats from "@/pages/applicationStats";
import Applicant from "@/pages/Lecturer";
import { APPLICATIONS } from "@/types/applications";
import { Geist, Geist_Mono } from "next/font/google";
import { useEffect } from "react";


// fonts
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});


// declarations 

// pie chart
interface IPie {
    x0: number;
    y0: number;
    radius: number;
}

// pie chart data 
interface IParts {
    value: number;
    label: string;
    startAngle: number;
    endAngle: number;
}

// application data
interface IApplication {
    applicantId: number;
}

export class PieChart {
    public readonly colors = ['#34a853', '#FBBC05', '#EA4335', '#4285F4'];
    private context: CanvasRenderingContext2D;
    private tipContext: CanvasRenderingContext2D;
    // canvas dimensions
    private data: IParts[] = [];
    private pie: IPie;
    private applications: any[] = [];
    private selectedCandidates: any[] = [];
    private finalSelectedCandidates: any[] = [];

    // constructor(canvas: HTMLCanvasElement, tooltip: HTMLCanvasElement) 
    // this is the constructor for the pie chart class, which takes in a canvas and a tooltip element.
    // it sets up the canvas context, pie chart dimensions, and adds event listeners for mouse movement and leaving the canvas
    // it also sets up the data for the pie chart, and adds a animation on load and hover. (mouse movement)
    constructor(private canvas: HTMLCanvasElement, private tooltip: HTMLCanvasElement) {
        this.context = canvas.getContext('2d')!;
        this.tipContext = tooltip.getContext('2d')!;
        this.pie = {
            x0: this.canvas.width / 2,
            y0: this.canvas.height / 2,
            radius: Math.min(this.canvas.width, this.canvas.height) / 2 * 0.9,
        };

        // Add hover listeners
        canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        canvas.addEventListener('mouseleave', () => this.drawPieChart(100)); // redraw default
    }

    // this function is called when the component mounts, and sets the data for the pie chart.
    setDataFromApplications(applications: any[], selectedCandidates: any[], finalSelectedCandidates: any[]) {
        this.applications = applications;
        this.selectedCandidates = selectedCandidates;
        this.finalSelectedCandidates = finalSelectedCandidates;

        this.render();
    }

    // this function is called when the component mounts, and sets the data for the pie chart.
    render() {
        this.data = this.getPieChartData();
        this.animatePieChart();
    }

    private getPieChartData(): IParts[] {
        const courseCount: Record<string, number> = {};
      
        // Count how often each course appears in final selection
        this.finalSelectedCandidates.forEach(candidate => {
          const courseCode = candidate.courseCode;
          courseCount[courseCode] = (courseCount[courseCode] || 0) + 1;
        });
      
        const counts = Object.values(courseCount);
        
        // calcuations for mostchosen and leastchosen and notselected
        const mostChosenCount = counts.length ? Math.max(...counts) : 0;
        const leastChosenCount = counts.filter(c => c > 0).length ? Math.min(...counts.filter(c => c > 0)) : 0;
      
        // Not selected means applicants never appeared in selectedCandidates
        const selectedIds = new Set([
          ...this.selectedCandidates.map(c => c.applicationId),
          ...this.finalSelectedCandidates.map(c => c.applicationId),
        ]);
        const notChosenCount = this.applications.filter(app => !selectedIds.has(app.applicantId)).length;
      
        // Create raw data for pie chart
        // Most Chosen, Least Chosen, Not Selected
        const rawData = [
          { label: 'Most Chosen', value: mostChosenCount },
          { label: 'Least Chosen', value: leastChosenCount },
          { label: 'Not Selected', value: notChosenCount },
        ];
      
        // assign angles
        const total = rawData.reduce((sum, d) => sum + d.value, 0);
        let startAngle = 0;
        
        // Create pie chart data with angles
        // this is the data that will be used to draw the pie chart
        return rawData.map(d => {
          const angle = (d.value / total) * 2 * Math.PI;
          const endAngle = startAngle + angle;
          const part = {
            label: d.label,
            value: d.value,
            startAngle,
            endAngle,
          };
          startAngle = endAngle;
          return part;
        });
      }
    
    // this function is called when the component mounts, and sets the data for the pie chart.
    // it sets the data for the pie chart, and adds a animation on load and hover. (mouse movement)
    private animatePieChart() {
        let progress = 0;
        const step = () => {
            if (progress <= 100) {
                this.drawPieChart(progress);
                progress += 3;
                requestAnimationFrame(step);
            }
        };
        requestAnimationFrame(step);
    }

    // this function draws the pie chart on the canvas, and takes in a progress value to animate the pie chart.
    // it also takes in a hoverIndex value to highlight the hovered segment of the pie chart.
    private drawPieChart(progress: number, hoverIndex?: number) {
        const ctx = this.context;
        const pie = this.pie;
        this.clear();

        const sum = this.sum(this.data.map(d => d.value));
        if (sum === 0) return;

        let startAngle = 0;

        this.data.forEach((part, i) => {
            //  Compute actual angle
            let angle = ((part.value / sum) * 2 * Math.PI) * (progress / 100);

            // If last segment, make sure it completes the circle
            if (i === this.data.length - 1) {
                angle = 2 * Math.PI - startAngle;
            }

            const endAngle = startAngle + angle;
            const radius = hoverIndex === i ? pie.radius * 1.05 : pie.radius;

            ctx.fillStyle = this.colors[i % this.colors.length];
            ctx.beginPath();
            ctx.moveTo(pie.x0, pie.y0);
            ctx.arc(pie.x0, pie.y0, radius, startAngle, endAngle);
            ctx.lineTo(pie.x0, pie.y0);
            ctx.fill();

            // Draw text
            const midAngle = startAngle + angle / 2;
            const labelX = pie.x0 + (radius / 2.1) * Math.cos(midAngle);
            const labelY = pie.y0 + (radius / 2.1) * Math.sin(midAngle);
            const percentage = ((part.value / sum) * 100).toFixed(1);

            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            if (hoverIndex === i) {
                ctx.font = 'bold 16px sans-serif';
                ctx.fillText(`${part.label}`, labelX, labelY - 12);
                ctx.fillText(`${percentage}% (${part.value})`, labelX, labelY + 12);
            } else {
                ctx.font = '14px sans-serif';
                ctx.fillText(`${part.label}`, labelX, labelY - 10);
                ctx.fillText(`${percentage}% (${part.value})`, labelX, labelY + 10);
            }

            startAngle = endAngle;
        });
    }

    // this function clears the canvas, and resets the pie chart to its default state.
    private clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // this function takes in an array of numbers, and returns the sum of the numbers in the array.
    // it is used to calculate the total value of the pie chart data.
    private sum(array: number[]): number {
        return array.reduce((a, b) => a + b, 0);
    }

    // hover animation on pie chart 
    // this function is called when the mouse moves over the pie chart, and it highlights the hovered segment of the pie chart.
    // it takes in a mouse event, and calculates the angle of the mouse position relative to the center of the pie chart.
    private onMouseMove(event: MouseEvent) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const dx = x - this.pie.x0;
        const dy = y - this.pie.y0;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Only react if inside pie radius
        if (distance > this.pie.radius) {
            this.drawPieChart(100);
            return;
        }

        const angle = Math.atan2(dy, dx) < 0 ? Math.atan2(dy, dx) + 2 * Math.PI : Math.atan2(dy, dx);

        let hoveredIndex = -1;
        for (let i = 0; i < this.data.length; i++) {
            if (angle >= this.data[i].startAngle && angle < this.data[i].endAngle) {
                hoveredIndex = i;
                break;
            }
        }

        this.drawPieChart(100, hoveredIndex); // redraw with hover highlight
    }
}