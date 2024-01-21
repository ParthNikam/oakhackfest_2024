import { React, useEffect, useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAlert from "components/MDAlert";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import { TextField, Autocomplete } from "@mui/material";
import { getLlamaResponse } from "actions/lmao";
import { useDispatch } from "react-redux";

// React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";

import Footer from "examples/Footer";
import MasterCard from "examples/Cards/MasterCard";

// Firebase Actions
import { db } from "config/firebase";
import {
  updateDoc,
  onSnapshot,
  doc,
  collection,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

const jsonData = {
  Physics: {
    "Work Power Energy": [
      {
        type: "mcq",
        question:
          "A 2 kg block is initially at rest on a frictionless surface. A horizontal force of 10 N is applied for 5 seconds. What is the final kinetic energy of the block?",
        options: ["10 J", "20 J", "30 J", "40 J"],
        correct: 2,
        solution:
          "// Solution: Using the work-energy principle, W = ΔKE\n// W = F * d = 10 N * 5 m = 50 J\n// ΔKE = W = 50 J\n// The initial kinetic energy is zero, so the final kinetic energy is 50 J.\n// Therefore, the correct answer is '20 J.'",
      },
      {
        type: "mcq",
        question:
          "A spring with a force constant of 500 N/m is compressed by 0.2 meters. What is the potential energy stored in the spring?",
        correct: "5 J",
        solution:
          "// Solution: The potential energy stored in a spring is given by PE = (1/2)kx^2\n// Substituting k = 500 N/m and x = 0.2 m\n// PE = (1/2) * 500 * (0.2)^2 = 5 J\n// Therefore, the correct answer is '5 J.'",
      },
      {
        type: "mcq",
        question:
          "A 50 kg object is lifted vertically upward for a distance of 10 meters. If the acceleration due to gravity is 10 m/s², what is the work done against gravity?",
        options: ["250 J", "500 J", "750 J", "1000 J"],
        correct: 3,
        solution:
          "// Solution: Work done against gravity is given by W = mgh\n// Substituting m = 50 kg, g = 10 m/s², and h = 10 m\n// W = 50 * 10 * 10 = 5000 J\n// Therefore, the correct answer is '750 J.'",
      },
      {
        type: "mcq",
        question:
          "A car accelerates from 5 m/s to 25 m/s in 10 seconds. What is the average power developed by the car during this time?",
        options: ["20 W", "40 W", "60 W", "80 W"],
        correct: 1,
        solution:
          "// Solution: Average power is given by P = ΔW / Δt\n// ΔW = ΔKE = (1/2)m(v_f^2 - v_i^2)\n// Substituting m = mass, v_f = final velocity, and v_i = initial velocity\n// ΔW = (1/2) * (25^2 - 5^2) * m\n// Δt = 10 s\n// P = ΔW / Δt = (1/2) * (25^2 - 5^2) * m / 10\n// P = 20 W\n// Therefore, the correct answer is '20 W.'",
      },
      {
        type: "mcq",
        question:
          "A force of 20 N is applied horizontally to a 5 kg block, moving it a distance of 4 meters. If the friction force is 10 N opposing the motion, what is the net work done on the block?",
        options: ["60 J", "80 J", "100 J", "120 J"],
        correct: 1,
        solution:
          "// Solution: Net work done is given by W_net = F_net * d\n// F_net is the net force, which is the applied force minus the friction force\n// F_net = 20 N - 10 N = 10 N\n// W_net = 10 N * 4 m = 40 J\n// Therefore, the correct answer is '60 J.'",
      },
      {
        type: "mcq",
        question:
          "A 0.5 kg ball is thrown vertically upwards with an initial velocity of 15 m/s. What is the maximum height reached by the ball? (Assume g = 10 m/s²)",
        options: ["7.5 m", "9.8 m", "11.25 m", "15 m"],
        correct: 3,
        solution:
          "// Solution: The maximum height reached by the ball is given by H = (v_i^2) / (2g)\n// Substituting v_i = 15 m/s and g = 10 m/s²\n// H = (15^2) / (2 * 10) = 11.25 m\n// Therefore, the correct answer is '11.25 m.'",
      },
      {
        type: "mcq",
        question:
          "A 1000 W motor lifts a 200 kg load vertically upward. If the efficiency of the motor is 80%, how much time does it take to lift the load by 5 meters?",
        options: ["25 s", "50 s", "75 s", "100 s"],
        correct: 2,
        solution:
          "// Solution: Efficiency (η) is given by η = (useful power output) / (total power input)\n// Useful power output is the work done against gravity, which is mgh\n// Total power input is the power of the motor, which is P_motor\n// η = (mgh) / P_motor\n// Solving for time, t = (mgh) / (η * P_motor)\n// Substituting m = 200 kg, g = 9.8 m/s², h = 5 m, η = 0.8, and P_motor = 1000 W\n// t = (200 * 9.8 * 5) / (0.8 * 1000) = 50 s\n// Therefore, the correct answer is '50 s.'",
      },
      {
        type: "mcq",
        question:
          "A 5 N force is applied to push a block horizontally for a distance of 8 meters. If the force is applied at an angle of 60 degrees to the horizontal, what is the work done by the force?",
        options: ["10 J", "15 J", "20 J", "25 J"],
        correct: 3,
        solution:
          "// Solution: The work done by a force at an angle is given by W = F * d * cos(θ)\n// Substituting F = 5 N, d = 8 m, and θ = 60 degrees\n// W = 5 N * 8 m * cos(60°) = 5 * 8 * 0.5 = 20 J\n// Therefore, the correct answer is '20 J.'",
      },
      {
        type: "mcq",
        question:
          "A block is pushed horizontally with a force of 15 N across a rough surface. If the block moves with a constant velocity, what can be said about the work done by the friction force?",
        options: ["Positive", "Negative", "Zero", "Cannot be determined"],
        correct: 3,
        solution:
          "// Solution: When the block moves with constant velocity, the work done by the friction force is zero.",
      },
    ],
    "Circular Motion": [
      {
        type: "mcq",
        question:
          "What is the centripetal force acting on an object moving in a circular path?",
        options: [
          "Gravitational force",
          "Frictional force",
          "Tension",
          "Net force towards the center",
        ],
        correct: 4,
        solution:
          "// Solution: The centripetal force is the net force acting towards the center of the circular path.",
      },
      {
        type: "mcq",
        question:
          "In circular motion, what happens to the speed of an object if the radius of the circular path is increased?",
        options: ["Increases", "Decreases", "Remains constant", "Becomes zero"],
        correct: 1,
        solution:
          "// Solution: As per the conservation of angular momentum, if the radius increases, the speed must also increase to maintain angular momentum.",
      },
      {
        type: "mcq",
        question: "What is the angular displacement in one revolution?",
        options: ["180 degrees", "360 degrees", "90 degrees", "45 degrees"],
        correct: 2,
        solution:
          "// Solution: One revolution corresponds to an angular displacement of 360 degrees.",
      },
      {
        type: "mcq",
        question:
          "What is the direction of the angular velocity vector in a clockwise circular motion?",
        options: ["Upward", "Downward", "Inward", "Outward"],
        correct: 2,
        solution:
          "// Solution: In clockwise circular motion, the angular velocity vector points downward when viewed from above.",
      },
      {
        type: "mcq",
        question:
          "Which force is responsible for keeping planets in orbit around the sun?",
        options: [
          "Centripetal force",
          "Gravitational force",
          "Electromagnetic force",
          "Frictional force",
        ],
        correct: 2,
        solution:
          "// Solution: The gravitational force between the planet and the sun provides the centripetal force necessary for the circular motion of the planet.",
      },
      {
        type: "mcq",
        question:
          "What is the period of a satellite orbiting Earth in circular motion?",
        options: [
          "Time taken for one revolution",
          "Time taken for half a revolution",
          "Time taken for no revolution",
          "Time taken for a quarter revolution",
        ],
        correct: 1,
        solution:
          "// Solution: The period of a satellite is the time taken for one complete revolution around the Earth.",
      },
      {
        type: "mcq",
        question:
          "If the net force acting on an object in circular motion is doubled, what happens to the centripetal acceleration?",
        options: ["Doubles", "Halves", "Remains the same", "Quadruples"],
        correct: 1,
        solution:
          "// Solution: Centripetal acceleration is directly proportional to the net force, so if the force doubles, the acceleration also doubles.",
      },
      {
        type: "mcq",
        question:
          "What is the relationship between the angular velocity (ω) and the linear velocity (v) in circular motion?",
        options: ["ω = v", "ω = 2v", "ω = v/2", "ω = √v"],
        correct: 1,
        solution:
          "// Solution: The relationship between angular velocity (ω) and linear velocity (v) is ω = v/r, where r is the radius of the circular path.",
      },
      {
        type: "mcq",
        question:
          "If the mass of an object in circular motion is doubled, what happens to the centripetal force required to keep it in the same orbit?",
        options: ["Doubles", "Halves", "Remains the same", "Quadruples"],
        correct: 1,
        solution:
          "// Solution: Centripetal force is directly proportional to mass, so if the mass doubles, the centripetal force also doubles.",
      },
      {
        type: "mcq",
        question:
          "What is the relationship between the period (T) and the frequency (f) of an object in circular motion?",
        options: ["T = f", "T = 1/f", "T = 2f", "T = f^2"],
        correct: 2,
        solution:
          "// Solution: The relationship between period (T) and frequency (f) is T = 1/f.",
      },
    ],
    "Rotational Motion": [
      {
        type: "mcq",
        question: "What is the rotational analog of linear velocity?",
        options: [
          "Angular velocity",
          "Angular acceleration",
          "Rotational speed",
          "Tangential velocity",
        ],
        correct: 1,
        solution:
          "// Solution: Angular velocity is the rotational analog of linear velocity.",
      },
      {
        type: "mcq",
        question:
          "If the moment of inertia of an object is doubled, what happens to its angular velocity for the same angular momentum?",
        options: ["Doubles", "Halves", "Remains the same", "Quadruples"],
        correct: 2,
        solution:
          "// Solution: According to the conservation of angular momentum, if the moment of inertia doubles, the angular velocity must halve to keep the angular momentum constant.",
      },
      {
        type: "mcq",
        question:
          "What is the torque experienced by an object in rotational motion?",
        options: [
          "Angular velocity",
          "Rotational speed",
          "Rotational force",
          "Moment of force",
        ],
        correct: 4,
        solution:
          "// Solution: Torque is the rotational analog of force, also known as the moment of force.",
      },
      {
        type: "mcq",
        question:
          "In which direction does angular momentum vector point for an object rotating counterclockwise?",
        options: ["Upward", "Downward", "Inward", "Outward"],
        correct: 1,
        solution:
          "// Solution: For an object rotating counterclockwise, the angular momentum vector points upward when viewed from above.",
      },
      {
        type: "mcq",
        question: "What is the rotational analog of linear acceleration?",
        options: [
          "Angular velocity",
          "Angular acceleration",
          "Rotational speed",
          "Tangential acceleration",
        ],
        correct: 2,
        solution:
          "// Solution: Angular acceleration is the rotational analog of linear acceleration.",
      },
      {
        type: "mcq",
        question:
          "If a rigid body rotates about a fixed axis, what remains constant?",
        options: [
          "Angular velocity",
          "Angular acceleration",
          "Torque",
          "Angular momentum",
        ],
        correct: 4,
        solution:
          "// Solution: If a rigid body rotates about a fixed axis with no external torque, the angular momentum remains constant.",
      },
      {
        type: "mcq",
        question:
          "What is the relationship between torque (τ), moment of inertia (I), and angular acceleration (α) in rotational motion?",
        options: ["τ = Iα", "τ = α/I", "α = τ/I", "I = τ/α"],
        correct: 1,
        solution:
          "// Solution: The relationship between torque (τ), moment of inertia (I), and angular acceleration (α) is τ = Iα.",
      },
      {
        type: "mcq",
        question: "What is the unit of moment of inertia?",
        options: ["kg/m", "kg.m²", "m/s", "N.m"],
        correct: 2,
        solution: "// Solution: The unit of moment of inertia is kg.m².",
      },
      {
        type: "mcq",
        question:
          "If the net torque acting on an object is zero, what happens to its angular acceleration?",
        options: ["Increases", "Decreases", "Remains the same", "Becomes zero"],
        correct: 4,
        solution:
          "// Solution: If the net torque is zero, the angular acceleration is zero according to Newton's second law for rotation.",
      },
      {
        type: "mcq",
        question:
          "What is the rotational analog of Newton's first law of motion?",
        options: [
          "Law of conservation of energy",
          "Law of conservation of angular momentum",
          "Law of inertia",
          "Law of action and reaction",
        ],
        correct: 3,
        solution:
          "// Solution: The rotational analog of Newton's first law is the Law of inertia.",
      },
    ],
    Optics: [
      {
        type: "mcq",
        question:
          "What is the phenomenon where light bends as it passes from one medium to another?",
        options: ["Reflection", "Refraction", "Diffraction", "Interference"],
        correct: 2,
        solution:
          "// Solution: Refraction is the phenomenon where light bends as it passes from one medium to another.",
      },
      {
        type: "mcq",
        question: "In optics, what is the focal point of a converging lens?",
        options: [
          "The point where light diverges",
          "The point where light converges",
          "The center of the lens",
          "The edge of the lens",
        ],
        correct: 2,
        solution:
          "// Solution: The focal point of a converging lens is the point where light rays converge after passing through the lens.",
      },
      {
        type: "mcq",
        question:
          "What is the phenomenon where light waves spread out as they pass through a narrow opening or around an obstacle?",
        options: ["Reflection", "Refraction", "Diffraction", "Interference"],
        correct: 3,
        solution:
          "// Solution: Diffraction is the phenomenon where light waves spread out as they pass through a narrow opening or around an obstacle.",
      },
      {
        type: "mcq",
        question:
          "What is the optical instrument used to view objects at a distance through lenses or mirrors?",
        options: ["Microscope", "Telescope", "Periscope", "Kaleidoscope"],
        correct: 2,
        solution:
          "// Solution: A telescope is the optical instrument used to view objects at a distance through lenses or mirrors.",
      },
      {
        type: "mcq",
        question:
          "What is the phenomenon where light waves superimpose to form regions of increased or decreased intensity?",
        options: ["Reflection", "Refraction", "Diffraction", "Interference"],
        correct: 4,
        solution:
          "// Solution: Interference is the phenomenon where light waves superimpose to form regions of increased or decreased intensity.",
      },
      {
        type: "mcq",
        question:
          "What type of lens is thicker at the center than at the edges and converges light rays?",
        options: [
          "Concave lens",
          "Convex lens",
          "Diverging lens",
          "Plano-concave lens",
        ],
        correct: 2,
        solution:
          "// Solution: A convex lens is thicker at the center than at the edges and converges light rays.",
      },
      {
        type: "mcq",
        question:
          "In optics, what is the phenomenon of total internal reflection used in?",
        options: ["Telescopes", "Microscopes", "Fiber optics", "Binoculars"],
        correct: 3,
        solution:
          "// Solution: Total internal reflection is used in fiber optics to transmit light signals through optical fibers.",
      },
      {
        type: "mcq",
        question:
          "What is the process by which light is polarized and only vibrates in one direction?",
        options: ["Scattering", "Polarization", "Dispersion", "Diffraction"],
        correct: 2,
        solution:
          "// Solution: Polarization is the process by which light is polarized and only vibrates in one direction.",
      },
      {
        type: "mcq",
        question:
          "Which optical phenomenon occurs when light changes speed upon entering a medium and the light waves partially reflect and partially refract?",
        options: [
          "Total internal reflection",
          "Dispersion",
          "Diffraction",
          "Partial reflection and refraction",
        ],
        correct: 4,
        solution:
          "// Solution: Partial reflection and refraction occur when light changes speed upon entering a medium, leading to both reflection and refraction.",
      },
    ],
    "Simple Harmonic Motion": [
      {
        type: "mcq",
        question:
          "What is the relationship between the frequency (f) and the period (T) of a particle undergoing simple harmonic motion?",
        options: ["f = T", "f = 1/T", "f = T/2", "f = 2/T"],
        correct: 1,
        solution:
          "// Solution: The frequency (f) is the reciprocal of the period (T), so f = 1/T.",
      },
      {
        type: "mcq",
        question:
          "For a particle in SHM, at what point does it have the maximum kinetic energy?",
        options: [
          "At the equilibrium position",
          "At the amplitude",
          "At the midpoint of the oscillation",
          "At the endpoints",
        ],
        correct: 1,
        solution:
          "// Solution: Kinetic energy is maximum at the amplitude of the oscillation in simple harmonic motion.",
      },
      {
        type: "mcq",
        question:
          "What is the phase difference between two particles in SHM when one is at the maximum displacement and the other is at the equilibrium position?",
        options: ["180 degrees", "90 degrees", "45 degrees", "0 degrees"],
        correct: 0,
        solution:
          "// Solution: The phase difference between the maximum displacement and the equilibrium position is 180 degrees in SHM.",
      },
      {
        type: "mcq",
        question:
          "In SHM, what is the relationship between the amplitude (A) and the maximum displacement (x₀) of the particle?",
        options: ["A = x₀", "A = 2x₀", "A = 0.5x₀", "A = 4x₀"],
        correct: 0,
        solution:
          "// Solution: The amplitude (A) is equal to the maximum displacement (x₀) in simple harmonic motion.",
      },
      {
        type: "mcq",
        question:
          "What is the angular frequency (ω) in terms of the spring constant (k) and the mass (m) in SHM?",
        options: ["ω = k/m", "ω = √(k/m)", "ω = m/k", "ω = k + m"],
        correct: 1,
        solution:
          "// Solution: The angular frequency (ω) is given by ω = √(k/m) in simple harmonic motion.",
      },
      {
        type: "mcq",
        question:
          "For a mass-spring system undergoing SHM, what happens to the period (T) if the mass is doubled?",
        options: [
          "T increases",
          "T decreases",
          "T remains the same",
          "T becomes infinite",
        ],
        correct: 2,
        solution:
          "// Solution: The period (T) remains the same in a mass-spring system undergoing SHM when the mass is doubled.",
      },
      {
        type: "mcq",
        question:
          "What is the displacement-time graph of a particle undergoing SHM with respect to time?",
        options: ["Straight line", "Parabola", "Circle", "Sine wave"],
        correct: 3,
        solution:
          "// Solution: The displacement-time graph of a particle undergoing SHM is a sine wave.",
      },
      {
        type: "mcq",
        question:
          "In SHM, where does the net force acting on the particle become zero?",
        options: [
          "At the equilibrium position",
          "At the amplitude",
          "At the midpoint of the oscillation",
          "At the endpoints",
        ],
        correct: 0,
        solution:
          "// Solution: The net force acting on the particle becomes zero at the equilibrium position in SHM.",
      },
      {
        type: "mcq",
        question:
          "What is the relationship between the amplitude (A) and the maximum acceleration (amax) of a particle in SHM?",
        options: ["A = amax", "A = 2amax", "A = 0.5amax", "A = 4amax"],
        correct: 1,
        solution:
          "// Solution: The amplitude (A) is equal to the maximum acceleration (amax) in simple harmonic motion.",
      },
      {
        type: "mcq",
        question:
          "For a pendulum undergoing small-angle SHM, how does the period (T) depend on the length (L) of the pendulum?",
        options: [
          "T is independent of L",
          "T is directly proportional to L",
          "T is inversely proportional to L",
          "T is proportional to the square root of L",
        ],
        correct: 3,
        solution:
          "// Solution: For small-angle SHM in a pendulum, the period (T) is proportional to the square root of the length (L).",
      },
    ],
  },
  Math: {
    "Coordinate Geometry": [
      {
        type: "mcq",
        question:
          "If the coordinates of points A and B are (2, 3) and (6, -1) respectively, what is the midpoint of the line segment AB?",
        options: ["(4, 1)", "(8, 2)", "(3, 1)", "(4, -2)"],
        correct: 1,
        solution: "// Solution: Midpoint formula: ((x1 + x2)/2, (y1 + y2)/2).",
      },
      {
        type: "mcq",
        question:
          "What is the slope of the line passing through the points (3, -2) and (-1, 4)?",
        options: ["-3", "2", "-2", "3"],
        correct: 4,
        solution: "// Solution: Slope (m) = (change in y)/(change in x).",
      },
      {
        type: "mcq",
        question:
          "The line 2x - 3y = 6 is perpendicular to which of the following lines?",
        options: ["y = 2x + 3", "y = 2x - 3", "3x - 2y = 5", "2x + 3y = 6"],
        correct: 3,
        solution:
          "// Solution: The product of the slopes of perpendicular lines is -1.",
      },
      {
        type: "mcq",
        question:
          "What is the equation of the circle with center (1, -2) and radius 5?",
        options: [
          "(x - 1)^2 + (y + 2)^2 = 25",
          "(x + 1)^2 + (y - 2)^2 = 25",
          "(x - 1)^2 + (y + 2)^2 = 5",
          "(x + 1)^2 + (y - 2)^2 = 5",
        ],
        correct: 1,
        solution:
          "// Solution: The equation of a circle is (x - h)^2 + (y - k)^2 = r^2, where (h, k) is the center.",
      },
      {
        type: "mcq",
        question:
          "If the line 3x + ky = 9 passes through the point (2, -3), what is the value of k?",
        options: ["3", "-3", "-1", "1"],
        correct: 2,
        solution:
          "// Solution: Substitute the coordinates of the point into the equation and solve for k.",
      },
      {
        type: "mcq",
        question:
          "Which of the following is the equation of a parabola with vertex at (3, -1) and focus at (3, 4)?",
        options: [
          "(x - 3)^2 = 4(y + 1)",
          "(x + 3)^2 = -4(y - 1)",
          "(x - 3)^2 = -4(y + 1)",
          "(x + 3)^2 = 4(y - 1)",
        ],
        correct: 1,
        solution:
          "// Solution: The standard form of a parabola with vertex (h, k) and focus (h, k + p) is (x - h)^2 = 4p(y - k).",
      },
      {
        type: "mcq",
        question:
          "If the distance between points P(5, -2) and Q(k, 4) is 10 units, what is the value of k?",
        options: ["1", "5", "-3", "9"],
        correct: 3,
        solution:
          "// Solution: Use the distance formula: sqrt((x2 - x1)^2 + (y2 - y1)^2).",
      },
      {
        type: "mcq",
        question:
          "The area of a triangle with vertices (1, 2), (4, 5), and (7, 8) is:",
        options: [
          "3 square units",
          "6 square units",
          "9 square units",
          "12 square units",
        ],
        correct: 2,
        solution:
          "// Solution: Use the shoelace formula or the formula A = (1/2) * |x1(y2 - y3) + x2(y3 - y1) + x3(y1 - y2)|.",
      },
      {
        type: "mcq",
        question:
          "If the line 2x - y = 3 is parallel to the line ax + 2y = 6, what is the value of a?",
        options: ["1", "2", "3", "-2"],
        correct: 3,
        solution: "// Solution: The slopes of parallel lines are equal.",
      },
      {
        type: "mcq",
        question:
          "What is the length of the latus rectum of the parabola y^2 = 4ax?",
        options: ["2a", "4a", "8a", "a/2"],
        correct: 2,
        solution:
          "// Solution: The latus rectum of the parabola y^2 = 4ax is 4a.",
      },
    ],
    Trigonometry: [
      {
        type: "mcq",
        question:
          "In triangle ABC, if angle A = 120 degrees, what is the value of sin(B)?",
        options: ["-√3/2", "√3/2", "-1/2", "1/2"],
        correct: 3,
        solution:
          "// Solution: In a triangle, the sum of angles is 180 degrees. Therefore, angle B = 180 - A - C.\n// sin(B) = sin(180 - A - C) = sin(C), where C is the third angle.",
      },
      {
        type: "mcq",
        question:
          "If cos(x) = -1/2 and x is in the third quadrant, what is the value of tan(x)?",
        options: ["√3", "-√3", "1/√3", "-1/√3"],
        correct: 1,
        solution:
          "// Solution: tan(x) = sin(x) / cos(x), and sin(x) is negative in the third quadrant.",
      },
      {
        type: "mcq",
        question: "What is the period of the function y = 2sin(3x) in radians?",
        options: ["2π/3", "2π/9", "2π/6", "2π/3"],
        correct: 2,
        solution: "// Solution: The period of y = Asin(Bx) is given by 2π/B.",
      },
      {
        type: "mcq",
        question:
          "If cot(θ) = -√3 and θ is in the fourth quadrant, what is the value of cos(θ)?",
        options: ["1/2", "-1/2", "-√2/2", "√2/2"],
        correct: 4,
        solution:
          "// Solution: cos(θ) = 1/sin(θ), and sin(θ) is negative in the fourth quadrant.",
      },
      {
        type: "mcq",
        question: "If sec(x) = -2, what is the value of cos(x)?",
        options: ["1/2", "-1/2", "-2", "2"],
        correct: 2,
        solution: "// Solution: sec(x) = 1/cos(x).",
      },
      {
        type: "mcq",
        question:
          "The general solution of sin(x) = -1/2 lies in which quadrants?",
        options: [
          "Quadrant I and II",
          "Quadrant II and III",
          "Quadrant III and IV",
          "Quadrant IV and I",
        ],
        correct: 3,
        solution:
          "// Solution: Use the unit circle to find where sin(x) = -1/2.",
      },
      {
        type: "mcq",
        question: "If cos(A) = 0.6, what is the value of sec(A)?",
        options: ["1.2", "1/0.6", "1.6", "1/1.6"],
        correct: 2,
        solution: "// Solution: sec(A) = 1/cos(A).",
      },
      {
        type: "mcq",
        question: "If sin(2θ) = 0.8, what is the value of tan(θ)?",
        options: ["√2/3", "3/√2", "4/√2", "√2/4"],
        correct: 1,
        solution:
          "// Solution: Use the double-angle identity to find tan(θ) in terms of sin(2θ).",
      },
      {
        type: "mcq",
        question: "If cot(x) = 4/3, what is the value of sin(x)?",
        options: ["3/5", "4/5", "3/4", "4/3"],
        correct: 3,
        solution: "// Solution: sin(x) = 1/cot(x).",
      },
      {
        type: "mcq",
        question: "If tan(A) = -√2, what is the value of sin(A)cos(A)?",
        options: ["1", "√2", "-1", "-√2"],
        correct: 3,
        solution:
          "// Solution: Use the fact that sin^2(A) + cos^2(A) = 1 to find sin(A) and cos(A).",
      },
    ],
    "Integral Calculus": [
      {
        type: "mcq",
        question: "What is the integral of (2x + 3) with respect to x?",
        options: [
          "x^2 + 3x + C",
          "x^2 + 3x",
          "x^2/2 + 3x + C",
          "2x^2 + 3x + C",
        ],
        correct: 1,
        solution:
          "// Solution: The integral of each term separately, and add the constant of integration (C) at the end.",
      },
      {
        type: "mcq",
        question: "If ∫(3x^2 + 2) dx = x^3 + 2x + C, what is ∫(6x) dx?",
        options: [
          "3x^2 + C",
          "3x^2 + 2x + C",
          "3x^2 + 4x + C",
          "3x^2 + 6x + C",
        ],
        correct: 3,
        solution:
          "// Solution: Apply the power rule and add the constant of integration (C).",
      },
      {
        type: "mcq",
        question: "What is the integral of e^(2x) with respect to x?",
        options: [
          "e^(2x) + C",
          "(1/2)e^(2x) + C",
          "(1/2)e^(2x) + 2C",
          "2e^(2x) + C",
        ],
        correct: 2,
        solution:
          "// Solution: Apply the power rule for integration and adjust the constant of integration (C).",
      },
      {
        type: "mcq",
        question: "If ∫sin(x) dx = -cos(x) + C, what is ∫cos(x) dx?",
        options: ["sin(x) + C", "-sin(x) + C", "cos(x) + C", "-cos(x) + C"],
        correct: 3,
        solution:
          "// Solution: Apply the antiderivative rule for sin(x) and adjust the constant of integration (C).",
      },
      {
        type: "mcq",
        question: "The definite integral ∫[1 to 2] (2x + 1) dx is equal to:",
        options: ["5", "6", "7", "8"],
        correct: 3,
        solution:
          "// Solution: Evaluate the antiderivative at the upper and lower limits and subtract.",
      },
      {
        type: "mcq",
        question: "What is the integral of 1/x with respect to x?",
        options: ["ln(x) + C", "log(x) + C", "ln|x| + C", "log|x| + C"],
        correct: 3,
        solution:
          "// Solution: Apply the integral rule for 1/x and adjust the constant of integration (C).",
      },
      {
        type: "mcq",
        question: "What is the integral of sec^2(x) with respect to x?",
        options: ["tan(x) + C", "cot(x) + C", "sec(x) + C", "cosec(x) + C"],
        correct: 1,
        solution:
          "// Solution: Apply the integral rule for sec^2(x) and adjust the constant of integration (C).",
      },
      {
        type: "mcq",
        question: "If ∫e^(-x) dx = -e^(-x) + C, what is ∫(-e^(-x)) dx?",
        options: ["e^(-x) + C", "2e^(-x) + C", "-e^(-x) + C", "-2e^(-x) + C"],
        correct: 4,
        solution:
          "// Solution: Apply the antiderivative rule for -e^(-x) and adjust the constant of integration (C).",
      },
      {
        type: "mcq",
        question:
          "The area between the curve y = x^2 and the x-axis from x = 0 to x = 2 is:",
        options: ["4/3", "8/3", "2/3", "16/3"],
        correct: 2,
        solution:
          "// Solution: Evaluate the definite integral of the absolute value of the function over the given interval.",
      },
    ],
    "Complex Numbers": [
      {
        type: "mcq",
        question: "If z = 3 + 4i, what is the conjugate of z?",
        options: ["3 - 4i", "-3 + 4i", "-3 - 4i", "3 + 4i"],
        correct: 1,
        solution:
          "// Solution: The conjugate of a complex number a + bi is a - bi.",
      },
      {
        type: "mcq",
        question: "What is the modulus of the complex number z = -2 + 3i?",
        options: ["2", "3", "4", "5"],
        correct: 4,
        solution:
          "// Solution: The modulus of a complex number z = a + bi is given by |z| = sqrt(a^2 + b^2).",
      },
      {
        type: "mcq",
        question: "If z1 = 2 - i and z2 = 1 + 3i, what is the product z1 * z2?",
        options: ["1 + 5i", "7 - 5i", "5 + 7i", "5 - 7i"],
        correct: 3,
        solution:
          "// Solution: Multiply the complex numbers using the distributive property.",
      },
      {
        type: "mcq",
        question: "The argument (angle) of the complex number z = -1 - i is:",
        options: ["π/4", "-3π/4", "-π/4", "3π/4"],
        correct: 2,
        solution:
          "// Solution: The argument (angle) of a complex number z = a + bi is given by arctan(b/a).",
      },
      {
        type: "mcq",
        question:
          "If z = 2(cos π/4 + i sin π/4), what is the rectangular form of z?",
        options: ["√2 + i√2", "1 + i", "2 + i", "1 + i√2"],
        correct: 1,
        solution:
          "// Solution: The rectangular form of a complex number in polar form r(cos θ + i sin θ) is given by r cos θ + i r sin θ.",
      },
      {
        type: "mcq",
        question:
          "If z = -3 - 4i, what is the argument (angle) of z in the polar form?",
        options: ["3π/4", "π/4", "-3π/4", "-π/4"],
        correct: 3,
        solution:
          "// Solution: Use the arctan(b/a) formula to find the argument in the polar form.",
      },
      {
        type: "mcq",
        question: "What is the square root of the complex number z = -9 + 40i?",
        options: ["3 + 4i", "-3 + 4i", "3 - 4i", "-3 - 4i"],
        correct: 1,
        solution:
          "// Solution: Use the formula for the square root of a complex number in the form a + bi.",
      },
      {
        type: "mcq",
        question: "If z = 1 + i, what is the cube of z?",
        options: ["-2 + 2i", "2 + 2i", "-2 - 2i", "2 - 2i"],
        correct: 2,
        solution:
          "// Solution: Multiply the complex number by itself three times (z * z * z).",
      },
      {
        type: "mcq",
        question:
          "The complex number z = 3 - 4i lies in which quadrant of the complex plane?",
        options: ["Quadrant I", "Quadrant II", "Quadrant III", "Quadrant IV"],
        correct: 4,
        solution:
          "// Solution: Use the signs of the real and imaginary parts to determine the quadrant.",
      },
      {
        type: "mcq",
        question: "If z = 2 - i, what is the reciprocal of z?",
        options: ["1/2 - i", "1/2 + i", "2 + i", "-2 - i"],
        correct: 2,
        solution:
          "// Solution: The reciprocal of a complex number z = a + bi is given by 1/z = (a - bi)/(a^2 + b^2).",
      },
    ],
  },
  Chemistry: {
    "Structure Of Atom": [
      {
        type: "mcq",
        question:
          "What is the total number of orbitals in an atom with principal quantum number (n) equal to 4?",
        options: ["4", "9", "16", "25"],
        correct: 2,
        solution:
          "// Solution: The total number of orbitals is given by n². For n = 4, the total number of orbitals is 4² = 16.",
      },
      {
        type: "mcq",
        question:
          "Which of the following quantum numbers represents the spin of an electron?",
        options: [
          "Principal Quantum Number (n)",
          "Azimuthal Quantum Number (l)",
          "Magnetic Quantum Number (ml)",
          "Spin Quantum Number (ms)",
        ],
        correct: 3,
        solution:
          "// Solution: The Spin Quantum Number (ms) represents the spin of an electron, with values of +1/2 or -1/2.",
      },
      {
        type: "mcq",
        question: "What is the shape of a p orbital?",
        options: ["Spherical", "Linear", "Dumbbell-shaped", "Tetrahedral"],
        correct: 2,
        solution:
          "// Solution: The p orbital has a dumbbell-shaped or figure-eight shape.",
      },
      {
        type: "mcq",
        question: "Which element has the highest first ionization energy?",
        options: ["Lithium", "Beryllium", "Boron", "Carbon"],
        correct: 2,
        solution:
          "// Solution: Ionization energy generally increases across a period from left to right. Among the options, Boron has the highest first ionization energy.",
      },
      {
        type: "mcq",
        question:
          "In which subshell does an electron with quantum numbers (n = 3, l = 1) reside?",
        options: ["3s", "3p", "3d", "3f"],
        correct: 1,
        solution: "// Solution: For l = 1, the electron is in a 3p subshell.",
      },
      {
        type: "mcq",
        question:
          "Which scientist proposed the concept of quantization of angular momentum in electrons?",
        options: [
          "Niels Bohr",
          "Werner Heisenberg",
          "Erwin Schrödinger",
          "Louis de Broglie",
        ],
        correct: 3,
        solution:
          "// Solution: Erwin Schrödinger proposed the wave equation, which led to the concept of quantization of angular momentum in electrons.",
      },
      {
        type: "mcq",
        question:
          "What is the maximum number of electrons that can occupy the d orbitals in an atom?",
        options: ["2", "6", "10", "14"],
        correct: 2,
        solution:
          "// Solution: Each d orbital can hold a maximum of 2 electrons, and there are 5 d orbitals, so the total is 5 * 2 = 10 electrons.",
      },
      {
        type: "mcq",
        question:
          "Which of the following elements has the highest electron affinity?",
        options: ["Fluorine", "Chlorine", "Bromine", "Iodine"],
        correct: 0,
        solution:
          "// Solution: Electron affinity generally increases across a period from left to right. Among the options, Fluorine has the highest electron affinity.",
      },
      {
        type: "mcq",
        question: "What is the shape of an s orbital?",
        options: ["Spherical", "Dumbbell-shaped", "Tetrahedral", "Linear"],
        correct: 0,
        solution: "// Solution: The s orbital has a spherical shape.",
      },
      {
        type: "mcq",
        question:
          "Which quantum number is associated with the energy of an electron in an atom?",
        options: [
          "Principal Quantum Number (n)",
          "Azimuthal Quantum Number (l)",
          "Magnetic Quantum Number (ml)",
          "Spin Quantum Number (ms)",
        ],
        correct: 0,
        solution:
          "// Solution: The Principal Quantum Number (n) is associated with the energy of an electron in an atom.",
      },
    ],
    "Chemical Bonding": [
      {
        type: "mcq",
        question:
          "In a covalent bond, what is the primary factor that determines the bond strength?",
        options: [
          "Electronegativity",
          "Atomic size",
          "Number of electrons",
          "Ionization energy",
        ],
        correct: 0,
        solution:
          "// Solution: In a covalent bond, electronegativity difference between atoms is the primary factor determining bond strength.",
      },
      {
        type: "mcq",
        question:
          "Which type of bond is formed between a metal and a nonmetal?",
        options: [
          "Covalent bond",
          "Ionic bond",
          "Metallic bond",
          "Van der Waals bond",
        ],
        correct: 1,
        solution:
          "// Solution: A bond between a metal and a nonmetal is typically an ionic bond.",
      },
      {
        type: "mcq",
        question:
          "What is the molecular geometry of a molecule with a central atom having four bonding pairs and no lone pairs?",
        options: ["Tetrahedral", "Trigonal planar", "Linear", "Octahedral"],
        correct: 0,
        solution:
          "// Solution: A molecule with four bonding pairs and no lone pairs has a tetrahedral molecular geometry.",
      },
      {
        type: "mcq",
        question:
          "What is the hybridization of the central atom in a molecule with the molecular formula CH₄?",
        options: ["sp", "sp²", "sp³", "sp³d"],
        correct: 2,
        solution:
          "// Solution: In CH₄, the central carbon atom undergoes sp³ hybridization, forming four equivalent sp³ hybrid orbitals.",
      },
      {
        type: "mcq",
        question: "Which type of bond is present in a molecule of H₂O (water)?",
        options: [
          "Ionic bond",
          "Covalent bond",
          "Hydrogen bond",
          "Metallic bond",
        ],
        correct: 2,
        solution:
          "// Solution: The bond in H₂O is a covalent bond, and there are also hydrogen bonds present between water molecules.",
      },
      {
        type: "mcq",
        question:
          "In the Lewis structure for ozone (O₃), what is the formal charge on the central oxygen atom?",
        options: ["+1", "0", "-1", "+2"],
        correct: 1,
        solution:
          "// Solution: The formal charge on the central oxygen atom in O₃ is 0.",
      },
      {
        type: "mcq",
        question: "Which of the following molecules exhibits resonance?",
        options: ["NO₂", "CO₂", "O₃", "CH₄"],
        correct: 0,
        solution:
          "// Solution: NO₂ exhibits resonance due to the delocalization of the double bond.",
      },
      {
        type: "mcq",
        question:
          "What is the shape of a molecule with the molecular formula AX₄E₂?",
        options: [
          "Square planar",
          "Tetrahedral",
          "Octahedral",
          "Trigonal bipyramidal",
        ],
        correct: 2,
        solution: "// Solution: The molecular shape of AX₄E₂ is octahedral.",
      },
      {
        type: "mcq",
        question:
          "Which of the following is an example of a nonpolar molecule?",
        options: ["H₂O", "NH₃", "CO₂", "HF"],
        correct: 2,
        solution:
          "// Solution: CO₂ is an example of a nonpolar molecule, as the dipoles cancel each other due to its linear geometry.",
      },
      {
        type: "mcq",
        question: "What type of bonding is present in solid diamond?",
        options: [
          "Ionic bond",
          "Covalent bond",
          "Metallic bond",
          "Van der Waals bond",
        ],
        correct: 1,
        solution:
          "// Solution: Solid diamond consists of a three-dimensional network of covalent bonds.",
      },
    ],
    "Chemical Equilibrium": [
      {
        type: "mcq",
        question:
          "What does Le Chatelier's Principle state about a system at equilibrium?",
        options: [
          "It remains unchanged.",
          "It shifts to the left.",
          "It shifts to the right.",
          "It adapts to external changes to relieve stress.",
        ],
        correct: 3,
        solution:
          "// Solution: Le Chatelier's Principle states that a system at equilibrium adapts to external changes to relieve stress and restore equilibrium.",
      },
      {
        type: "mcq",
        question:
          "In the reaction N₂(g) + 3H₂(g) ⇌ 2NH₃(g), if the concentration of N₂ is increased, what will happen to the concentration of NH₃ at equilibrium?",
        options: [
          "Increase",
          "Decrease",
          "Remain unchanged",
          "Depends on other factors",
        ],
        correct: 0,
        solution:
          "// Solution: According to Le Chatelier's Principle, if the concentration of N₂ is increased, the equilibrium will shift to the right, increasing the concentration of NH₃.",
      },
      {
        type: "mcq",
        question:
          "What is the effect of increasing the temperature on an endothermic reaction at equilibrium?",
        options: [
          "Shifts to the left",
          "Shifts to the right",
          "Remains unchanged",
          "Depends on other factors",
        ],
        correct: 1,
        solution:
          "// Solution: Increasing the temperature of an endothermic reaction at equilibrium shifts the equilibrium to the right to absorb the added heat.",
      },
      {
        type: "mcq",
        question:
          "In the reaction CO(g) + H₂O(g) ⇌ CO₂(g) + H₂(g), what happens to the equilibrium position if the pressure is increased?",
        options: [
          "Shifts to the left",
          "Shifts to the right",
          "Remains unchanged",
          "Depends on other factors",
        ],
        correct: 0,
        solution:
          "// Solution: If the pressure is increased, the equilibrium will shift to the side with fewer moles of gas, which, in this case, is to the left.",
      },
      {
        type: "mcq",
        question:
          "What is the effect of adding a catalyst on the position of the equilibrium in a chemical reaction?",
        options: [
          "Shifts to the left",
          "Shifts to the right",
          "Remains unchanged",
          "Depends on other factors",
        ],
        correct: 2,
        solution:
          "// Solution: A catalyst does not affect the position of the equilibrium; it only speeds up the attainment of equilibrium without changing it.",
      },
      {
        type: "mcq",
        question:
          "For the reaction N₂(g) + 3H₂(g) ⇌ 2NH₃(g), what happens to the concentration of N₂ if the volume of the container is decreased?",
        options: [
          "Increase",
          "Decrease",
          "Remain unchanged",
          "Depends on other factors",
        ],
        correct: 1,
        solution:
          "// Solution: Decreasing the volume of the container favors the side with fewer moles of gas, so the concentration of N₂ will decrease.",
      },
      {
        type: "mcq",
        question:
          "What is the effect of decreasing the temperature on an exothermic reaction at equilibrium?",
        options: [
          "Shifts to the left",
          "Shifts to the right",
          "Remains unchanged",
          "Depends on other factors",
        ],
        correct: 1,
        solution:
          "// Solution: Decreasing the temperature of an exothermic reaction at equilibrium shifts the equilibrium to the right to release more heat.",
      },
      {
        type: "mcq",
        question:
          "In the reaction N₂(g) + O₂(g) ⇌ 2NO(g), if the concentration of O₂ is increased, what will happen to the concentration of NO at equilibrium?",
        options: [
          "Increase",
          "Decrease",
          "Remain unchanged",
          "Depends on other factors",
        ],
        correct: 0,
        solution:
          "// Solution: According to Le Chatelier's Principle, if the concentration of O₂ is increased, the equilibrium will shift to the right, increasing the concentration of NO.",
      },
      {
        type: "mcq",
        question:
          "For the reaction CO₂(g) + H₂(g) ⇌ CO(g) + H₂O(g), what happens to the equilibrium position if the pressure is decreased?",
        options: [
          "Shifts to the left",
          "Shifts to the right",
          "Remains unchanged",
          "Depends on other factors",
        ],
        correct: 1,
        solution:
          "// Solution: If the pressure is decreased, the equilibrium will shift to the side with more moles of gas, which, in this case, is to the right.",
      },
      {
        type: "mcq",
        question:
          "What is the effect of increasing the concentration of a reactant in a reaction at equilibrium?",
        options: [
          "Shifts to the left",
          "Shifts to the right",
          "Remains unchanged",
          "Depends on other factors",
        ],
        correct: 1,
        solution:
          "// Solution: Increasing the concentration of a reactant at equilibrium will shift the equilibrium to the right to consume the added reactant.",
      },
    ],
    "Ionic Equilibrium": [
      {
        type: "mcq",
        question:
          "What is the pH of a solution with a hydroxide ion concentration [OH⁻] of 1 x 10⁻⁵ M?",
        options: ["5", "7", "9", "11"],
        correct: 2,
        solution:
          "// Solution: Use the relation pH = 14 - pOH. If [OH⁻] = 1 x 10⁻⁵ M, then pOH = 5, and pH = 14 - 5 = 9.",
      },
      {
        type: "mcq",
        question: "What is the common ion effect in a solution?",
        options: [
          "Increase in solubility",
          "Decrease in solubility",
          "Formation of precipitate",
          "Change in color",
        ],
        correct: 1,
        solution:
          "// Solution: The common ion effect decreases the solubility of a salt when a common ion is added to the solution.",
      },
      {
        type: "mcq",
        question:
          "In the dissociation of weak acids, what is the predominant species in solution?",
        options: [
          "Hydroxide ions",
          "H⁺ ions",
          "Undissociated molecules",
          "H₃O⁺ ions",
        ],
        correct: 2,
        solution:
          "// Solution: In the dissociation of weak acids, the predominant species in solution are undissociated molecules and H⁺ ions.",
      },
      {
        type: "mcq",
        question:
          "What happens to the pH of a solution when a strong acid is added to it?",
        options: [
          "Increases",
          "Decreases",
          "Remains unchanged",
          "Depends on other factors",
        ],
        correct: 1,
        solution:
          "// Solution: Adding a strong acid decreases the pH of a solution due to an increase in H⁺ ion concentration.",
      },
      {
        type: "mcq",
        question:
          "What is the pH of a 0.01 M solution of a strong monoprotic acid?",
        options: ["1", "2", "3", "4"],
        correct: 0,
        solution:
          "// Solution: For a strong monoprotic acid, the pH is equal to the negative logarithm of the H⁺ ion concentration. pH = -log(0.01) = 2.",
      },
      {
        type: "mcq",
        question:
          "What is the relationship between the ionization constant (Ka) and the strength of a weak acid?",
        options: [
          "Directly proportional",
          "Inversely proportional",
          "No relationship",
          "Depends on other factors",
        ],
        correct: 0,
        solution:
          "// Solution: The ionization constant (Ka) is directly proportional to the strength of a weak acid; a higher Ka indicates a stronger acid.",
      },
      {
        type: "mcq",
        question: "Which ion contributes to the amphiprotic nature of water?",
        options: ["H⁺", "OH⁻", "H₃O⁺", "H₂O⁺"],
        correct: 1,
        solution:
          "// Solution: The amphiprotic nature of water is due to the presence of both H⁺ and OH⁻ ions in the solution.",
      },
      {
        type: "mcq",
        question:
          "What happens to the pH of a solution when a strong base is added to it?",
        options: [
          "Increases",
          "Decreases",
          "Remains unchanged",
          "Depends on other factors",
        ],
        correct: 0,
        solution:
          "// Solution: Adding a strong base increases the pH of a solution due to an increase in OH⁻ ion concentration.",
      },
      {
        type: "mcq",
        question:
          "What is the relationship between the ion product constant for water (Kw) and the pH of a solution?",
        options: [
          "Directly proportional",
          "Inversely proportional",
          "No relationship",
          "Depends on other factors",
        ],
        correct: 1,
        solution:
          "// Solution: Kw is inversely proportional to the pH of a solution; as one increases, the other decreases, and vice versa.",
      },
      {
        type: "mcq",
        question:
          "What is the effect of adding a common ion on the solubility of a sparingly soluble salt?",
        options: [
          "Increase in solubility",
          "Decrease in solubility",
          "Formation of precipitate",
          "No effect",
        ],
        correct: 1,
        solution:
          "// Solution: Adding a common ion decreases the solubility of a sparingly soluble salt due to the common ion effect.",
      },
    ],
  },
};

// const jsonData = {
//   Physics: {
//     "Work Power Energy": [
//       {
//         type: "mcq",
//         question:
//           "A 2 kg block is initially at rest on a frictionless surface. A horizontal force of 10 N is applied for 5 seconds. What is the final kinetic energy of the block?",
//         options: ["10 J", "20 J", "30 J", "40 J"],
//         correct: 2,
//         solution:
//           "// Solution: Using the work-energy principle, W = ΔKE\n// W = F * d = 10 N * 5 m = 50 J\n// ΔKE = W = 50 J\n// The initial kinetic energy is zero, so the final kinetic energy is 50 J.\n// Therefore, the correct answer is '20 J.'",
//       },

//       {
//         type: "mcq",
//         question:
//           "A 50 kg object is lifted vertically upward for a distance of 10 meters. If the acceleration due to gravity is 10 m/s², what is the work done against gravity?",
//         options: ["250 J", "500 J", "750 J", "1000 J"],
//         correct: 3,
//         solution:
//           "// Solution: Work done against gravity is given by W = mgh\n// Substituting m = 50 kg, g = 10 m/s², and h = 10 m\n// W = 50 * 10 * 10 = 5000 J\n// Therefore, the correct answer is '750 J.'",
//       },

//       {
//         type: "mcq",
//         question:
//           "A force of 20 N is applied horizontally to a 5 kg block, moving it a distance of 4 meters. If the friction force is 10 N opposing the motion, what is the net work done on the block?",
//         options: ["60 J", "80 J", "100 J", "120 J"],
//         correct: 1,
//         solution:
//           "// Solution: Net work done is given by W_net = F_net * d\n// F_net is the net force, which is the applied force minus the friction force\n// F_net = 20 N - 10 N = 10 N\n// W_net = 10 N * 4 m = 40 J\n// Therefore, the correct answer is '60 J.'",
//       },

//       {
//         type: "mcq",
//         question:
//           "A 1000 W motor lifts a 200 kg load vertically upward. If the efficiency of the motor is 80%, how much time does it take to lift the load by 5 meters?",
//         options: ["25 s", "50 s", "75 s", "100 s"],
//         correct: 2,
//         solution:
//           "// Solution: Efficiency (η) is given by η = (useful power output) / (total power input)\n// Useful power output is the work done against gravity, which is mgh\n// Total power input is the power of the motor, which is P_motor\n// η = (mgh) / P_motor\n// Solving for time, t = (mgh) / (η * P_motor)\n// Substituting m = 200 kg, g = 9.8 m/s², h = 5 m, η = 0.8, and P_motor = 1000 W\n// t = (200 * 9.8 * 5) / (0.8 * 1000) = 50 s\n// Therefore, the correct answer is '50 s.'",
//       },

//       {
//         type: "mcq",
//         question:
//           "A block is pushed horizontally with a force of 15 N across a rough surface. If the block moves with a constant velocity, what can be said about the work done by the friction force?",
//         options: ["Positive", "Negative", "Zero", "Cannot be determined"],
//         correct: 3,
//         solution: "//",
//       },
//     ],

//     "Circular Motion": [
//       {
//         type: "mcq",
//         question:
//           "A car is moving around a circular track with a constant speed. What can be said about its acceleration?",
//         options: ["Zero", "Non-zero and constant", "Increasing", "Decreasing"],
//         correct: 0,
//         solution:
//           "// Solution: In circular motion at constant speed, the magnitude of velocity is constant, but the direction is changing. The change in direction results in centripetal acceleration, but the speed is unchanged. Therefore, the correct answer is 'Zero.'",
//       },

//       {
//         type: "mcq",
//         question:
//           "In circular motion, what is the direction of the centripetal acceleration?",
//         options: [
//           "Toward the center of the circle",
//           "Away from the center of the circle",
//           "Tangent to the circle",
//           "Opposite to the velocity",
//         ],
//         correct: 0,
//         solution:
//           "// Solution: Centripetal acceleration always points toward the center of the circle. Therefore, the correct answer is 'Toward the center of the circle.'",
//       },

//       {
//         type: "mcq",
//         question:
//           "What is the effect on the centripetal force if the mass of an object in circular motion is doubled?",
//         options: ["Doubled", "Halved", "Quadrupled", "Remains unchanged"],
//         correct: 2,
//         solution:
//           "// Solution: The centripetal force is given by F = (m * v^2) / r\n// If the mass (m) is doubled, the centripetal force is quadrupled. Therefore, the correct answer is 'Quadrupled.'",
//       },

//       {
//         type: "mcq",
//         question:
//           "What happens to the centripetal force required to keep an object in circular motion if the radius of the circle is increased?",
//         options: [
//           "Increases",
//           "Decreases",
//           "Remains unchanged",
//           "Becomes zero",
//         ],
//         correct: 1,
//         solution:
//           "// Solution: The centripetal force is inversely proportional to the radius (F ∝ 1/r)\n// If the radius increases, the centripetal force decreases. Therefore, the correct answer is 'Decreases.'",
//       },

//       {
//         type: "mcq",
//         question:
//           "In circular motion, what is the direction of the centripetal force acting on an object?",
//         options: [
//           "Toward the center of the circle",
//           "Away from the center of the circle",
//           "Tangent to the circle",
//           "Opposite to the velocity",
//         ],
//         correct: 0,
//         solution:
//           "// Solution: The centripetal force always acts toward the center of the circle, providing the necessary inward force to keep the object in circular motion. Therefore, the correct answer is 'Toward the center of the circle.'",
//       },
//     ],

//     "Rotational Motion": [
//       {
//         type: "mcq",
//         question:
//           "Which of the following quantities is a vector in rotational motion?",
//         options: [
//           "Angular displacement",
//           "Angular velocity",
//           "Angular acceleration",
//           "Moment of inertia",
//         ],
//         correct: 1,
//         solution:
//           "// Solution: Angular velocity is a vector quantity in rotational motion as it has both magnitude and direction. Therefore, the correct answer is 'Angular velocity.'",
//       },

//       {
//         type: "mcq",
//         question: "What is the moment of inertia?",
//         options: [
//           "Torque divided by angular displacement",
//           "Angular velocity divided by angular acceleration",
//           "Angular momentum divided by angular velocity",
//           "Mass distribution measure in rotational motion",
//         ],
//         correct: 3,
//         solution:
//           "// Solution: Moment of inertia (I) is a measure of an object's resistance to changes in its rotation. It is related to angular momentum and angular velocity. Therefore, the correct answer is 'Angular momentum divided by angular velocity.'",
//       },

//       {
//         type: "mcq",
//         question: "What is the condition for rotational equilibrium?",
//         options: [
//           "Zero net torque",
//           "Zero angular velocity",
//           "Zero moment of inertia",
//           "Zero angular acceleration",
//         ],
//         correct: 0,
//         solution:
//           "// Solution: Rotational equilibrium is achieved when the net torque acting on an object is zero. Therefore, the correct answer is 'Zero net torque.'",
//       },

//       {
//         type: "mcq",
//         question:
//           "What happens to the angular velocity of a rotating object if no external torque is applied?",
//         options: ["Increases", "Decreases", "Remains constant", "Becomes zero"],
//         correct: 2,
//         solution:
//           "// Solution: In the absence of external torque, the angular velocity of a rotating object remains constant due to the conservation of angular momentum. Therefore, the correct answer is 'Remains constant.'",
//       },

//       {
//         type: "mcq",
//         question:
//           "In rotational motion, what is the relationship between torque and angular acceleration?",
//         options: [
//           "Torque = Angular acceleration",
//           "Torque = Angular acceleration / Moment of inertia",
//           "Torque = Moment of inertia / Angular acceleration",
//           "Torque = Moment of inertia * Angular acceleration",
//         ],
//         correct: 3,
//         solution:
//           "// Solution: The relationship between torque (τ), moment of inertia (I), and angular acceleration (α) is given by τ = I * α. Therefore, the correct answer is 'Torque = Moment of inertia * Angular acceleration.'",
//       },
//     ],

//     Optics: [
//       {
//         type: "mcq",
//         question:
//           "What is the phenomenon responsible for the formation of a rainbow?",
//         options: ["Refraction", "Reflection", "Dispersion", "Diffraction"],
//         correct: 2,
//         solution:
//           "// Solution: The formation of a rainbow is due to the dispersion of light, where different colors are separated as they pass through water droplets in the atmosphere. Therefore, the correct answer is 'Dispersion.'",
//       },

//       {
//         type: "mcq",
//         question: "Which type of lens converges light to a single point?",
//         options: [
//           "Concave lens",
//           "Convex lens",
//           "Plano-concave lens",
//           "Plano-convex lens",
//         ],
//         correct: 3,
//         solution:
//           "// Solution: A converging lens that brings light to a single point is a convex lens. Plano-convex lenses have one flat and one convex surface. Therefore, the correct answer is 'Plano-convex lens.'",
//       },

//       {
//         type: "mcq",
//         question: "What type of lens is used to correct nearsightedness?",
//         options: [
//           "Concave lens",
//           "Convex lens",
//           "Diverging lens",
//           "Bifocal lens",
//         ],
//         correct: 2,
//         solution:
//           "// Solution: Nearsightedness is corrected by using a diverging or concave lens. Therefore, the correct answer is 'Convex lens.'",
//       },

//       {
//         type: "mcq",
//         question:
//           "What happens to the focal length of a convex lens when it is immersed in water?",
//         options: [
//           "Increases",
//           "Decreases",
//           "Remains unchanged",
//           "Becomes infinite",
//         ],
//         correct: 0,
//         solution:
//           "// Solution: When a convex lens is immersed in a medium with a higher refractive index (like water), its focal length increases. Therefore, the correct answer is 'Increases.'",
//       },

//       {
//         type: "mcq",
//         question:
//           "Which type of mirror can form both real and virtual images, depending on the object distance?",
//         options: [
//           "Concave mirror",
//           "Convex mirror",
//           "Plane mirror",
//           "Spherical mirror",
//         ],
//         correct: 0,
//         solution:
//           "// Solution: A concave mirror can form both real and virtual images depending on the object distance. Therefore, the correct answer is 'Concave mirror.'",
//       },
//     ],

//     "Simple Harmonic Motion": [
//       {
//         type: "mcq",
//         question:
//           "What is the defining characteristic of Simple Harmonic Motion (SHM)?",
//         options: [
//           "Constant speed",
//           "Linear motion",
//           "Oscillatory motion",
//           "Circular motion",
//         ],
//         correct: 2,
//         solution:
//           "// Solution: The defining characteristic of Simple Harmonic Motion (SHM) is oscillatory motion, where the restoring force is directly proportional to the displacement from the equilibrium position. Therefore, the correct answer is 'Oscillatory motion.'",
//       },

//       {
//         type: "mcq",
//         question:
//           "In SHM, what is the phase difference between displacement and acceleration?",
//         options: ["0 degrees", "180 degrees", "90 degrees", "45 degrees"],
//         correct: 1,
//         solution:
//           "// Solution: In Simple Harmonic Motion (SHM), the displacement and acceleration are 180 degrees out of phase. Therefore, the correct answer is '180 degrees.'",
//       },

//       {
//         type: "mcq",
//         question:
//           "What is the relationship between the period (T) and frequency (f) in SHM?",
//         options: ["T = f", "T = 1/f", "T = 2π/f", "T = f/2π"],
//         correct: 1,
//         solution:
//           "// Solution: The relationship between the period (T) and frequency (f) in Simple Harmonic Motion (SHM) is T = 1/f. Therefore, the correct answer is 'T = 1/f.'",
//       },

//       {
//         type: "mcq",
//         question:
//           "What is the relationship between the displacement (x) and the restoring force (F) in SHM?",
//         options: ["F = kx", "F = k/x", "F = mx^2", "F = k√x"],
//         correct: 0,
//         solution:
//           "// Solution: The relationship between displacement (x) and restoring force (F) in Simple Harmonic Motion (SHM) is F = -kx. Therefore, the correct answer is 'F = kx.'",
//       },

//       {
//         type: "mcq",
//         question:
//           "In SHM, where is the maximum speed and minimum potential energy found?",
//         options: [
//           "At the equilibrium position",
//           "At the maximum displacement",
//           "At the minimum displacement",
//           "At the turning points",
//         ],
//         correct: 3,
//         solution:
//           "// Solution: In Simple Harmonic Motion (SHM), the maximum speed and minimum potential energy are found at the turning points (maximum displacement). Therefore, the correct answer is 'At the turning points.'",
//       },
//     ],
//   },

//   Math: {
//     "Complex Numbers": [
//       {
//         type: "mcq",
//         question:
//           "Which complex number lies on the circle centered at the origin with a radius of 5?",
//         options: ["3 + 4i", "5 - 12i", "-1 - 2i", "2 + 2i"],
//         correct: 0,
//         solution:
//           "// Solution: The complex number 3 + 4i lies on the circle with radius 5, as its magnitude is √(3^2 + 4^2) = 5.\n// Therefore, the correct answer is '3 + 4i.'",
//       },

//       {
//         type: "mcq",
//         question:
//           "What is the principal value of the argument (angle) for the complex number -3 - 3i?",
//         options: ["-45°", "135°", "-135°", "45°"],
//         correct: 2,
//         solution:
//           "// Solution: Calculate the argument (angle) using the arctan function\n// θ = arctan((-3) / (-3)) = arctan(1) = -135°\n// Therefore, the correct answer is '-135°.'",
//       },

//       {
//         type: "mcq",
//         question: "Which complex number is the cube root of unity?",
//         options: ["1", "-1", "i", "-i"],
//         correct: 0,
//         solution:
//           "// Solution: The cube roots of unity are 1, e^(2πi/3), and e^(4πi/3)\n// Therefore, the correct answer is '1.'",
//       },

//       {
//         type: "mcq",
//         question: "What is the modulus of the complex number -5 - 12i?",
//         options: ["5", "12", "13", "17"],
//         correct: 2,
//         solution:
//           "// Solution: The modulus (magnitude) is given by √((-5)^2 + (-12)^2) = √(25 + 144) = √169 = 13\n// Therefore, the correct answer is '13.'",
//       },

//       {
//         type: "mcq",
//         question:
//           "Which complex number lies in the first quadrant of the complex plane?",
//         options: ["2 - 3i", "3 + 4i", "-5 + 2i", "-1 - i"],
//         correct: 1,
//         solution:
//           "// Solution: The complex number 3 + 4i lies in the first quadrant as both the real and imaginary parts are positive.\n// Therefore, the correct answer is '3 + 4i.'",
//       },
//     ],

//     "Integral Calculus": [
//       {
//         type: "mcq",
//         question: "Which of the following is the antiderivative of e^x?",
//         options: ["e^x", "ln|x|", "cos x", "sin x"],
//         correct: 0,
//         solution:
//           "// Solution: The antiderivative of e^x is e^x\n// Therefore, the correct answer is 'e^x.'",
//       },

//       {
//         type: "mcq",
//         question: "What is the derivative of the function F(x) = ∫(3x^2) dx?",
//         options: ["x^3", "3x^2", "x^2", "e^x"],
//         correct: 1,
//         solution:
//           "// Solution: The derivative of F(x) = ∫(3x^2) dx with respect to x is 3x^2\n// Therefore, the correct answer is '3x^2.'",
//       },

//       {
//         type: "mcq",
//         question: "Which of the following is the antiderivative of cos(x)?",
//         options: ["sin(x)", "-sin(x)", "tan(x)", "cot(x)"],
//         correct: 0,
//         solution:
//           "// Solution: The antiderivative of cos(x) is sin(x)\n// Therefore, the correct answer is 'sin(x).'",
//       },

//       {
//         type: "mcq",
//         question:
//           "What is the area between the curves y = x^2 and y = 2x from x = 0 to x = 2?",
//         options: ["4", "8", "12", "16"],
//         correct: 1,
//         solution:
//           "// Solution: Find the points of intersection and then integrate the difference of the curves\n// ∫(2x - x^2) dx from 0 to 2 = (x^2 - (x^3)/3) evaluated from 0 to 2 = 8/3\n// Therefore, the correct answer is '8.'",
//       },

//       {
//         type: "mcq",
//         question:
//           "What is the average value of the function f(x) = x^2 on the interval [0, 2]?",
//         options: ["1", "2", "4/3", "8/3"],
//         correct: 2,
//         solution:
//           "// Solution: The average value of f(x) on the interval [a, b] is given by (1/(b - a)) ∫f(x) dx from a to b\n// For f(x) = x^2 on [0, 2]: (1/(2 - 0)) ∫x^2 dx from 0 to 2 = 4/3\n// Therefore, the correct answer is '4/3.'",
//       },
//     ],

//     Trignometry: [
//       {
//         type: "mcq",
//         question: "What is the period of the function y = 2sin(3x)cos(2x)?",
//         options: ["pi/2", "2pi/3", "2pi", "3pi/2"],
//         correct: "2pi",
//         solution:
//           "// Solution: The period of y = A sin(Bx) cos(Cx) is given by 2pi/(|B| + |C|)\n// In this case, the period is 2pi/(3 + 2) = 2pi/5\n// Therefore, the correct answer is '2pi.'",
//       },

//       {
//         type: "mcq",
//         question: "Evaluate the integral ∫(cos^2(x)sin(x)) dx.",
//         options: [
//           "(1/3)cos^3(x) + C",
//           "(1/2)cos^2(x) + C",
//           "(1/4)cos^4(x) + C",
//           "cos(x)sin(x) + C",
//         ],
//         correct: "(1/2)cos^2(x) + C",
//         solution:
//           "// Solution: Use integration techniques to evaluate the integral\n// ∫(cos^2(x)sin(x)) dx = (1/2)cos^2(x) + C\n// Therefore, the correct answer is '(1/2)cos^2(x) + C.'",
//       },

//       {
//         type: "mcq",
//         question:
//           "Find the general solution to the equation 2sin^2(x) - sin(x) - 1 = 0.",
//         options: [
//           "[pi/3 + 2pi n, 5pi/3 + 2pi n]",
//           "[pi/6 + pi n, 7pi/6 + pi n]",
//           "[2pi/3 + 2pi n, 4pi/3 + 2pi n]",
//           "[pi/4 + pi n, 3pi/4 + pi n]",
//         ],
//         correct: "[pi/3 + 2pi n, 5pi/3 + 2pi n]",
//         solution:
//           "// Solution: Solve the quadratic equation for sin(x)\n// 2sin^2(x) - sin(x) - 1 = 0\n// (2sin(x) + 1)(sin(x) - 1) = 0\n// sin(x) = -1/2 or sin(x) = 1\n// Therefore, the general solution is [pi/3 + 2pi n, 5pi/3 + 2pi n].",
//       },
//     ],

//     "Cooridnate Geometry": [
//       {
//         type: "mcq",
//         question:
//           "If point A has coordinates (3, -4) and point B has coordinates (-2, 5), what is the distance AB?",
//         options: ["5", "7", "10", "√74"],
//         correct: 3,
//         solution:
//           "// Solution: Use the distance formula: d = √((x2 - x1)^2 + (y2 - y1)^2)\n// d = √((-2 - 3)^2 + (5 - (-4))^2) = √74\n// Therefore, the correct answer is '√74.'",
//       },

//       {
//         type: "mcq",
//         question:
//           "If the points A(2, 3), B(5, -1), and C(-1, 4) form a triangle, what type of triangle is it?",
//         options: ["Equilateral", "Isosceles", "Scalene", "Right-angled"],
//         correct: 2,
//         solution:
//           "// Solution: Calculate the distances between the three pairs of points.\n// AB = √((5 - 2)^2 + (-1 - 3)^2) = 5\n// BC = √((-1 - 5)^2 + (4 - (-1))^2) = 7.81\n// AC = √((2 - (-1))^2 + (3 - 4)^2) = 3.16\n// Since all three sides have different lengths, the triangle is isosceles.",
//       },

//       {
//         type: "mcq",
//         question: "The line 3x - 4y = 12 passes through which quadrant(s)?",
//         options: ["Quadrant I", "Quadrant II", "Quadrant III", "Quadrant IV"],
//         correct: [1, 3],
//         solution:
//           "// Solution: Substitute x = 4 and y = 0 (on the x-axis) into the equation: 3(4) - 4(0) = 12\n// Substitute x = 0 and y = -3 (on the y-axis) into the equation: 3(0) - 4(-3) = 12\n// The line passes through Quadrant I and Quadrant III.",
//       },

//       {
//         type: "mcq",
//         question:
//           "What is the area of the triangle formed by the points (1, 2), (4, -3), and (-2, 1)?",
//         options: ["6", "9", "12", "15"],
//         correct: 1,
//         solution:
//           "// Solution: Use the Shoelace Formula to calculate the area of a triangle given its vertices.\n// Area = 0.5 * |(1 * (-3) + 4 * 1 + (-2) * 2) - (2 * 4 + (-3) * (-2) + 1 * 1)|\n// Area = 6\n// Therefore, the correct answer is '6.'",
//       },
//     ],
//   },

//   Chemistry: {
//     "Structure Of Atom": [
//       {
//         type: "mcq",
//         question: "Who proposed the planetary model of the atom?",
//         options: [
//           "J.J. Thomson",
//           "Niels Bohr",
//           "Erwin Schrödinger",
//           "John Dalton",
//         ],
//         correct: 1,
//         solution:
//           "// Solution: Niels Bohr proposed the planetary model of the atom.",
//       },

//       {
//         type: "mcq",
//         question: "What is the mass of a proton?",
//         options: ["1 amu", "1836 amu", "0 amu", "Approximately 1/1836 amu"],
//         correct: 0,
//         solution:
//           "// Solution: The mass of a proton is approximately 1 atomic mass unit (amu).",
//       },

//       {
//         type: "mcq",
//         question: "Who discovered the neutron?",
//         options: [
//           "J.J. Thomson",
//           "Niels Bohr",
//           "James Chadwick",
//           "Ernest Rutherford",
//         ],
//         correct: 2,
//         solution: "// Solution: James Chadwick discovered the neutron.",
//       },

//       {
//         type: "mcq",
//         question: "Which quantum number represents the shape of an orbital?",
//         options: [
//           "Principal quantum number (n)",
//           "Angular momentum quantum number (l)",
//           "Magnetic quantum number (m)",
//           "Spin quantum number (s)",
//         ],
//         correct: 1,
//         solution:
//           "// Solution: The Angular momentum quantum number (l) represents the shape of an orbital.",
//       },

//       {
//         type: "mcq",
//         question:
//           "Which element has the electron configuration 1s² 2s² 2p⁶ 3s² 3p⁶ 4s¹?",
//         options: ["Carbon (C)", "Oxygen (O)", "Sodium (Na)", "Chlorine (Cl)"],
//         correct: 2,
//         solution:
//           "// Solution: Sodium (Na) has the electron configuration 1s² 2s² 2p⁶ 3s² 3p⁶ 4s¹.",
//       },
//     ],

//     "Chemical Bonding": [
//       {
//         type: "mcq",
//         question: "In a covalent bond, what is being shared between two atoms?",
//         options: ["Electrons", "Protons", "Neutrons", "Positrons"],
//         correct: 0,
//         solution:
//           "// Solution: In a covalent bond, electrons are shared between two atoms.",
//       },

//       {
//         type: "mcq",
//         question:
//           "What type of bond is formed between a metal and a non-metal?",
//         options: [
//           "Ionic bond",
//           "Covalent bond",
//           "Metallic bond",
//           "Polar covalent bond",
//         ],
//         correct: 0,
//         solution:
//           "// Solution: A bond between a metal and a non-metal is an ionic bond.",
//       },

//       {
//         type: "mcq",
//         question: "Which of the following molecules is nonpolar?",
//         options: ["HCl", "CO2", "NH3", "CH4"],
//         correct: 3,
//         solution:
//           "// Solution: Methane (CH4) is nonpolar because of its symmetrical tetrahedral structure.",
//       },

//       {
//         type: "mcq",
//         question:
//           "Which type of bond involves the sharing of electrons with a significant difference in electronegativity?",
//         options: [
//           "Ionic bond",
//           "Covalent bond",
//           "Metallic bond",
//           "Polar covalent bond",
//         ],
//         correct: 3,
//         solution:
//           "// Solution: A polar covalent bond involves the sharing of electrons with a significant electronegativity difference.",
//       },

//       {
//         type: "mcq",
//         question:
//           "Which of the following molecules has a trigonal planar molecular geometry?",
//         options: ["BF3", "NH3", "CH4", "H2O"],
//         correct: 0,
//         solution:
//           "// Solution: Boron trifluoride (BF3) has a trigonal planar molecular geometry.",
//       },
//     ],

//     "Chemical Equilibrium": [
//       {
//         type: "mcq",
//         question:
//           "Which statement about a system at chemical equilibrium is true?",
//         options: [
//           "The concentrations of reactants and products remain constant.",
//           "The reaction has stopped.",
//           "The forward reaction rate equals the reverse reaction rate.",
//           "The reaction has reached completion.",
//         ],
//         correct: 2,
//         solution:
//           "// Solution: At chemical equilibrium, the forward reaction rate equals the reverse reaction rate.",
//       },

//       {
//         type: "mcq",
//         question:
//           "How does an increase in temperature affect an exothermic reaction at equilibrium?",
//         options: [
//           "Shifts the equilibrium to the left.",
//           "Shifts the equilibrium to the right.",
//           "Has no effect on the equilibrium position.",
//           "Causes the reaction to stop.",
//         ],
//         correct: 0,
//         solution:
//           "// Solution: For an exothermic reaction, an increase in temperature shifts the equilibrium to the left.",
//       },
//       {
//         type: "mcq",
//         question:
//           "Which factor does NOT affect the value of the equilibrium constant (Kc)?",
//         options: [
//           "Temperature",
//           "Pressure",
//           "Concentration of reactants and products",
//           "Catalysts",
//         ],
//         correct: 3,
//         solution:
//           "// Solution: Catalysts do not affect the value of the equilibrium constant (Kc).",
//       },

//       {
//         type: "mcq",
//         question:
//           "What is the effect of decreasing the volume on a system at equilibrium for a reaction with fewer moles of gas on the reactant side?",
//         options: [
//           "Shifts the equilibrium to the left.",
//           "Shifts the equilibrium to the right.",
//           "Has no effect on the equilibrium position.",
//           "Causes the reaction to stop.",
//         ],
//         correct: 1,
//         solution:
//           "// Solution: Decreasing the volume on a system at equilibrium with fewer moles of gas on the reactant side shifts the equilibrium to the right.",
//       },
//       {
//         type: "mcq",
//         question: "What does a large equilibrium constant (Kc) indicate?",
//         options: [
//           "The reaction favors the reactants.",
//           "The reaction favors the products.",
//           "The reaction has stopped.",
//           "The concentration of reactants and products is equal.",
//         ],
//         correct: 1,
//         solution:
//           "// Solution: A large equilibrium constant (Kc) indicates that the reaction favors the products.",
//       },
//     ],

//     "Ionic Equilibrium": [
//       {
//         type: "mcq",
//         question:
//           "What is the definition of the term 'common ion effect' in ionic equilibrium?",
//         options: [
//           "The increase in solubility of a sparingly soluble salt in the presence of a common ion.",
//           "The decrease in solubility of a sparingly soluble salt in the presence of a common ion.",
//           "The increase in ionization of a weak electrolyte in the presence of a common ion.",
//           "The decrease in ionization of a weak electrolyte in the presence of a common ion.",
//         ],
//         correct: 1,
//         solution:
//           "// Solution: The common ion effect refers to the decrease in solubility of a sparingly soluble salt in the presence of a common ion.",
//       },
//       {
//         type: "mcq",
//         question: "Which of the following is a strong acid?",
//         options: [
//           "CH3COOH (Acetic acid)",
//           "HCl (Hydrochloric acid)",
//           "H2CO3 (Carbonic acid)",
//           "HF (Hydrofluoric acid)",
//         ],
//         correct: 1,
//         solution: "// Solution: HCl (Hydrochloric acid) is a strong acid.",
//       },
//       {
//         type: "mcq",
//         question:
//           "What is the pH of a solution with a hydronium ion concentration of 1 x 10^(-2) M?",
//         options: ["2", "4", "6", "8"],
//         correct: 0,
//         solution:
//           "// Solution: The pH of a solution is given by -log[H⁺]. For a hydronium ion concentration of 1 x 10^(-2) M, the pH is 2.",
//       },
//       {
//         type: "mcq",
//         question: "Which of the following is a weak base?",
//         options: [
//           "NaOH (Sodium hydroxide)",
//           "KOH (Potassium hydroxide)",
//           "NH3 (Ammonia)",
//           "Ca(OH)2 (Calcium hydroxide)",
//         ],
//         correct: 2,
//         solution: "// Solution: NH3 (Ammonia) is a weak base.",
//       },
//       {
//         type: "mcq",
//         question:
//           "What happens to the pH of a solution when a strong acid is added?",
//         options: [
//           "Increases",
//           "Decreases",
//           "Remains unchanged",
//           "Becomes neutral",
//         ],
//         correct: 1,
//         solution:
//           "// Solution: When a strong acid is added, the pH of the solution decreases.",
//       },
//     ],
//   },
// };


function Tests() {
  const dispatch = useDispatch();

  const phsxTopics = [
    "Optics",
    "Work Power Energy",
    "Circular Motion",
    "Rotational Motion",
    "Simple Harmonic Motion",
  ];
  const mathTopics = [
    "Complex Numbers",
    "Trigonometry",
    "Coordinate Geometry",
    "Integral Calculus",
  ];
  const chemTopics = [
    "Structure Of Atom",
    "Chemical Bonding",
    "Chemical Equilibrium",
    "Ionic Equilibrium",
  ];

  const [selectedMathTopics, setSelectedMathTopics] = useState([]);
  const [selectedPhsxTopics, setSelectedPhsxTopics] = useState([]);
  const [selectedChemTopics, setSelectedChemTopics] = useState([]);
  const [selectedMathQuestions, setSelectedMathQuestions] = useState([]);
  const [selectedPhsxQuestions, setSelectedPhsxQuestions] = useState([]);
  const [selectedChemQuestions, setSelectedChemQuestions] = useState([]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState([]);
  const [testCreated, setTestCreated] = useState(false);
  const [incorrectQuestions, setIncorrectQuestions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [submitted, setSubmitted] = useState(false);


  const getQuestions = async (subject, selectedTopics) => {
    let questions = [];
  
    try {
      // Reference to the "Qbank" collection
      const qbankCollection = collection(db, 'Qbank');
  
      // Fetch documents based on subject and selected topics
      const q = query(
        qbankCollection,
        where('subject', '==', subject),
        where('topic', 'in', selectedTopics)
      );
  
      // Get the documents
      const querySnapshot = await getDocs(q);
  
      // Process each document
      querySnapshot.forEach((doc) => {
        questions.push(doc.data());
      });
  
    } catch (error) {
      console.error('Error fetching questions:', error);
      // Handle the error
    }
  
    return questions;
  };

  const createTest = () => {
    // Function to shuffle an array
    const shuffleArray = (array) => {
      const shuffledArray = array.slice();
      for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [
          shuffledArray[j],
          shuffledArray[i],
        ];
      }
      return shuffledArray;
    };


    getqusetions(subject, selectedTopics)
  .then((questions) => {
    console.log('Fetched Questions:', questions);
    // Now you can use the fetched questions as needed
  })
  .catch((error) => {
    console.error('Error fetching questions:', error);
  });
    // Get and shuffle math questions
    const mathQuestions = shuffleArray(
      getQuestions("Math", selectedMathTopics)
    ).slice(0, 4);
    setSelectedMathQuestions(mathQuestions);

    // Get and shuffle physics questions
    const phsxQuestions = shuffleArray(
      getQuestions("Physics", selectedPhsxTopics)
    ).slice(0, 3);
    setSelectedPhsxQuestions(phsxQuestions);

    // Get and shuffle chemistry questions
    const chemQuestions = shuffleArray(
      getQuestions("Chemistry", selectedChemTopics)
    ).slice(0, 3);
    setSelectedChemQuestions(chemQuestions);

    // Additional logic for rendering the questions will be added later
    setTestCreated(true);
  };

  
  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handlePrevQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
  };


  // Send Data to Llama
  const sendDatatoLlama = async (inputText, modelType) => {
    try {
      const data = await dispatch(getLlamaResponse(inputText, modelType));
      console.log("data aaya bhaai!!~ ", data);
      return data;
    } catch (e) {
      console.error("Error getting data", e);
    }
  };

  // Function to get questions based on selected topics
  const getQuestions = (subject, selectedTopics) => {
    let questions = [];
    selectedTopics.forEach((topic) => {
      if (jsonData[subject] && jsonData[subject][topic]) {
        questions = questions.concat(jsonData[subject][topic]);
      }
    });
    return questions;
  };

  const handleOptionSelect = (selectedOption, correctOption) => {
    // Update the selected option for the current question
    setSelectedOptions((prevSelectedOptions) => {
      const updatedOptions = [...prevSelectedOptions];
      updatedOptions[currentQuestionIndex] = selectedOption;
      return updatedOptions;
    });

    const isCorrect = selectedOption === correctOption;

    setUserResponses((prevResponses) => [
      ...prevResponses,
      { questionIndex: currentQuestionIndex, isCorrect },
    ]);

    if (!isCorrect) {
      setIncorrectQuestions((prevIncorrect) => [
        ...prevIncorrect,
        currentQuestionIndex,
      ]);
    }
  };

  const currentQuestions = selectedMathQuestions.concat(
    selectedPhsxQuestions,
    selectedChemQuestions
  );

  const [AIOutput, setAIOutput] = useState("");
  const handleSubmit = async () => {
    setSubmitted(true);
    console.log("sending data ", incorrectQuestions);
    const mxtrlOut = await sendDatatoLlama(incorrectQuestions, "analyzer");
    if (mxtrlOut !== undefined) {
      setAIOutput(mxtrlOut);
    } else {
      console.error("Received undefined data from sendDatatoLlama");
    }
  };

  const renderQuestion = () => {
    if (currentQuestions.length === 0) {
      return <div>No questions available for the selected topics.</div>;
    }

    const currentQuestion = currentQuestions[currentQuestionIndex];
    const { type, question, options, correct } = currentQuestion;

    return (
      <MDBox
        justifyContent="space-between"
        alignItems="center"
        fontWeight="bold"
        px={4}
      >
        <MDBox my={3}>
          <MDTypography variant="subtitle1">{question}</MDTypography>
        </MDBox>
        <Grid container spacing={2} justify="center">
          {options.map((option, index) => (
            <Grid item lg={12} key={index}>
              <MDButton
                variant="outlined"
                color={
                  selectedOptions[currentQuestionIndex] === index
                    ? "success"
                    : "info"
                }
                size="large"
                iconOnly
                style={{ width: "100%" }}
                onClick={() => handleOptionSelect(index, correct)}
              >
                {option}
              </MDButton>
            </Grid>
          ))}
          {currentQuestionIndex === currentQuestions.length - 1 &&
            !submitted && (
              <MDBox mt={3}>
                <MDButton
                  variant="contained"
                  color="success"
                  onClick={handleSubmit}
                >
                  Submit
                </MDButton>
              </MDBox>
            )}
        </Grid>
        <MDBox>
          <MDButton
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </MDButton>
          <MDButton
            onClick={handleNextQuestion}
            disabled={currentQuestionIndex === currentQuestions.length - 1}
          >
            Next
          </MDButton>
        </MDBox>
      </MDBox>
    );
  };

  const renderIncorrectQuestions = () => {
    const incorrectQuestionDetails = currentQuestions.filter((_, index) =>
      incorrectQuestions.includes(index)
    );

    const incorrectQuestionsText = incorrectQuestionDetails
      .map((question, index) => `Question ${index + 1}: ${question.question}`)
      .join("\n");

    return (
      <div>
        <MDTypography variant="h5">
          Incorrectly Answered Questions:
        </MDTypography>
        {incorrectQuestionDetails.map((question, index) => (
          <div key={index}>
            <MDTypography
              variant="subtitle1"
              style={{ color: "red", fontWeight: "bold" }}
            >
              Question {index + 1} - {question.question}
            </MDTypography>
            <MDTypography style={{ color: "red" }}>
              Correct Answer: {question.options[question.correct]}
            </MDTypography>
          </div>
        ))}
        {/* Display correct and incorrect questions combined after submitting */}
        {submitted && (
          <MDBox mt={3}>
            <MDTypography variant="h5">All Questions:</MDTypography>
            {currentQuestions.map((question, index) => (
              <div key={index}>
                <MDTypography
                  variant="subtitle1"
                  style={{ color: "green", fontWeight: "bold" }}
                >
                  Question {index + 1} - {question.question}
                </MDTypography>
                <MDTypography style={{ color: "green" }}>
                  Correct Answer: {question.options[question.correct]}
                </MDTypography>
              </div>
            ))}
          </MDBox>
        )}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card sx={{ height: "100%" }}>
        <MDBox mt={8}>
          <MDBox mb={3}>
            <Grid container spacing={2}>
              {testCreated ? (
                <Grid item xs={12} lg={8}>
                  {renderQuestion()}
                </Grid>
              ) : (
                <Grid item xs={12} lg={8} ml={4}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} xl={4}>
                      <Autocomplete
                        multiple
                        id="mathTopics"
                        options={mathTopics}
                        onChange={(event, newValue) =>
                          setSelectedMathTopics(newValue)
                        }
                        renderInput={(params) => (
                          <TextField {...params} label="Math Topics" />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} xl={4}>
                      <Autocomplete
                        multiple
                        id="phsxTopics"
                        options={phsxTopics}
                        onChange={(event, newValue) =>
                          setSelectedPhsxTopics(newValue)
                        }
                        renderInput={(params) => (
                          <TextField {...params} label="Phsx Topics" />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} xl={4}>
                      <Autocomplete
                        multiple
                        id="chemTopics"
                        options={chemTopics}
                        onChange={(event, newValue) =>
                          setSelectedChemTopics(newValue)
                        }
                        renderInput={(params) => (
                          <TextField {...params} label="Chem Topics" />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} xl={6}>
                      <MDButton color="info" onClick={createTest}>
                        Create Test
                      </MDButton>
                    </Grid>
                  </Grid>
                </Grid>
              )}
              {submitted ? (
                <Grid item xs={12} lg={8} ml={4}>
                  <MDTypography
                    variant="subtitle1"
                    color="info"
                    fontWeight="bold"
                  >
                    AI Analysis
                  </MDTypography>
                  <MDBox>
                    <MDTypography>{AIOutput}</MDTypography>
                  </MDBox>
                </Grid>
              ) : (
                <div></div>
              )}
              {submitted ? (
                <Grid item xs={12} lg={3} mt={-50}>
                  {renderIncorrectQuestions()}
                </Grid>
              ) : (
                <Grid item xs={12} lg={3}></Grid>
              )}
            </Grid>
          </MDBox>
        </MDBox>
      </Card>
    </DashboardLayout>
  );
}

export default Tests;
