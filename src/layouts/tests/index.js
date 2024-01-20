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

// React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MasterCard from "examples/Cards/MasterCard";
import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";

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
        type: "num",
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
        type: "num",
        question:
          "A car accelerates from 5 m/s to 25 m/s in 10 seconds. What is the average power developed by the car during this time?",
        correct: "20 W",
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
        type: "num",
        question:
          "A 0.5 kg ball is thrown vertically upwards with an initial velocity of 15 m/s. What is the maximum height reached by the ball? (Assume g = 10 m/s²)",
        correct: "11.25 m",
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
        type: "num",
        question:
          "A 5 N force is applied to push a block horizontally for a distance of 8 meters. If the force is applied at an angle of 60 degrees to the horizontal, what is the work done by the force?",
        correct: "20 J",
        solution:
          "// Solution: The work done by a force at an angle is given by W = F * d * cos(θ)\n// Substituting F = 5 N, d = 8 m, and θ = 60 degrees\n// W = 5 N * 8 m * cos(60°) = 5 * 8 * 0.5 = 20 J\n// Therefore, the correct answer is '20 J.'",
      },
      {
        type: "mcq",
        question:
          "A block is pushed horizontally with a force of 15 N across a rough surface. If the block moves with a constant velocity, what can be said about the work done by the friction force?",
        options: ["Positive", "Negative", "Zero", "Cannot be determined"],
        correct: 3,
        solution: "//",
      },
    ],

    "Circular Motion": [
      {
        type: "mcq",
        question:
          "A car is moving around a circular track with a constant speed. What can be said about its acceleration?",
        options: ["Zero", "Non-zero and constant", "Increasing", "Decreasing"],
        correct: 0,
        solution:
          "// Solution: In circular motion at constant speed, the magnitude of velocity is constant, but the direction is changing. The change in direction results in centripetal acceleration, but the speed is unchanged. Therefore, the correct answer is 'Zero.'",
      },
      {
        type: "num",
        question:
          "A 0.5 kg object is attached to a string and is swung in a horizontal circle of radius 2 meters. If the tension in the string is 20 N, calculate the speed of the object.",
        correct: "4 m/s",
        solution:
          "// Solution: The centripetal force is provided by tension in the string: T = (m * v^2) / r\n// Substituting T = 20 N, m = 0.5 kg, and r = 2 m\n// 20 = (0.5 * v^2) / 2\n// Solving for v, v = 4 m/s\n// Therefore, the correct answer is '4 m/s.'",
      },
      {
        type: "mcq",
        question:
          "In circular motion, what is the direction of the centripetal acceleration?",
        options: [
          "Toward the center of the circle",
          "Away from the center of the circle",
          "Tangent to the circle",
          "Opposite to the velocity",
        ],
        correct: 0,
        solution:
          "// Solution: Centripetal acceleration always points toward the center of the circle. Therefore, the correct answer is 'Toward the center of the circle.'",
      },
      {
        type: "num",
        question:
          "A car is moving around a circular track of radius 50 meters at a speed of 20 m/s. Calculate the centripetal acceleration of the car.",
        correct: "0.8 m/s²",
        solution:
          "// Solution: The centripetal acceleration is given by a = v^2 / r\n// Substituting v = 20 m/s and r = 50 m\n// a = 20^2 / 50 = 0.8 m/s²\n// Therefore, the correct answer is '0.8 m/s².'",
      },
      {
        type: "mcq",
        question:
          "What is the effect on the centripetal force if the mass of an object in circular motion is doubled?",
        options: ["Doubled", "Halved", "Quadrupled", "Remains unchanged"],
        correct: 2,
        solution:
          "// Solution: The centripetal force is given by F = (m * v^2) / r\n// If the mass (m) is doubled, the centripetal force is quadrupled. Therefore, the correct answer is 'Quadrupled.'",
      },
      {
        type: "num",
        question:
          "A bicycle travels around a circular path with a radius of 10 meters. If the rider completes one full revolution in 40 seconds, calculate the speed of the bicycle.",
        correct: "5 m/s",
        solution:
          "// Solution: The speed (v) can be calculated using the formula v = (2 * π * r) / T\n// Substituting r = 10 m and T = 40 s\n// v = (2 * 3.14 * 10) / 40 = 5 m/s\n// Therefore, the correct answer is '5 m/s.'",
      },
      {
        type: "mcq",
        question:
          "What happens to the centripetal force required to keep an object in circular motion if the radius of the circle is increased?",
        options: [
          "Increases",
          "Decreases",
          "Remains unchanged",
          "Becomes zero",
        ],
        correct: 1,
        solution:
          "// Solution: The centripetal force is inversely proportional to the radius (F ∝ 1/r)\n// If the radius increases, the centripetal force decreases. Therefore, the correct answer is 'Decreases.'",
      },
      {
        type: "num",
        question:
          "A 1 kg object is attached to a string and is swung in a vertical circle of radius 2 meters. If the tension in the string at the bottom of the circle is 30 N, calculate the speed of the object at that point.",
        correct: "6 m/s",
        solution:
          "// Solution: The tension in the string at the bottom provides both the centripetal and gravitational forces: T = (m * v^2) / r + m * g\n// Substituting T = 30 N, m = 1 kg, r = 2 m, and g = 9.8 m/s²\n// 30 = (1 * v^2) / 2 + 1 * 9.8\n// Solving for v, v = 6 m/s\n// Therefore, the correct answer is '6 m/s.'",
      },
      {
        type: "mcq",
        question:
          "In circular motion, what is the direction of the centripetal force acting on an object?",
        options: [
          "Toward the center of the circle",
          "Away from the center of the circle",
          "Tangent to the circle",
          "Opposite to the velocity",
        ],
        correct: 0,
        solution:
          "// Solution: The centripetal force always acts toward the center of the circle, providing the necessary inward force to keep the object in circular motion. Therefore, the correct answer is 'Toward the center of the circle.'",
      },
      {
        type: "num",
        question:
          "A satellite is in a circular orbit around Earth with a radius of 5000 km. If the orbital speed is 8000 m/s, calculate the centripetal acceleration of the satellite.",
        correct: "1.28 m/s²",
        solution:
          "// Solution: The centripetal acceleration is given by a = v^2 / r\n// Substituting v = 8000 m/s and r = 5000 km (convert to meters: 5000 * 1000)\n// a = 8000^2 / (5000 * 1000) = 1.28 m/s²\n// Therefore, the correct answer is '1.28 m/s².'",
      },
    ],

    "Rotational Motion": [
      {
        type: "mcq",
        question:
          "Which of the following quantities is a vector in rotational motion?",
        options: [
          "Angular displacement",
          "Angular velocity",
          "Angular acceleration",
          "Moment of inertia",
        ],
        correct: 1,
        solution:
          "// Solution: Angular velocity is a vector quantity in rotational motion as it has both magnitude and direction. Therefore, the correct answer is 'Angular velocity.'",
      },
      {
        type: "num",
        question:
          "A wheel is rotating at 120 revolutions per minute. Calculate its angular velocity in radians per second.",
        correct: "12.57 rad/s",
        solution:
          "// Solution: Angular velocity (ω) is given by ω = 2π * (revolutions per minute) / 60\n// Substituting revolutions per minute = 120\n// ω = 2π * 120 / 60 = 12.57 rad/s\n// Therefore, the correct answer is '12.57 rad/s.'",
      },
      {
        type: "mcq",
        question: "What is the moment of inertia?",
        options: [
          "Torque divided by angular displacement",
          "Angular velocity divided by angular acceleration",
          "Angular momentum divided by angular velocity",
          "Mass distribution measure in rotational motion",
        ],
        correct: 3,
        solution:
          "// Solution: Moment of inertia (I) is a measure of an object's resistance to changes in its rotation. It is related to angular momentum and angular velocity. Therefore, the correct answer is 'Angular momentum divided by angular velocity.'",
      },
      {
        type: "num",
        question:
          "A disk has a moment of inertia of 0.2 kg·m² and is rotating at an angular velocity of 4 rad/s. Calculate its angular momentum.",
        correct: "0.8 kg·m²/s",
        solution:
          "// Solution: Angular momentum (L) is given by L = I * ω\n// Substituting I = 0.2 kg·m² and ω = 4 rad/s\n// L = 0.2 * 4 = 0.8 kg·m²/s\n// Therefore, the correct answer is '0.8 kg·m²/s.'",
      },
      {
        type: "mcq",
        question: "What is the condition for rotational equilibrium?",
        options: [
          "Zero net torque",
          "Zero angular velocity",
          "Zero moment of inertia",
          "Zero angular acceleration",
        ],
        correct: 0,
        solution:
          "// Solution: Rotational equilibrium is achieved when the net torque acting on an object is zero. Therefore, the correct answer is 'Zero net torque.'",
      },
      {
        type: "num",
        question:
          "A force of 10 N is applied tangentially to a wheel of radius 0.5 meters. Calculate the torque produced by the force.",
        correct: "5 N·m",
        solution:
          "// Solution: Torque (τ) is given by τ = r * F\n// Substituting r = 0.5 meters and F = 10 N\n// τ = 0.5 * 10 = 5 N·m\n// Therefore, the correct answer is '5 N·m.'",
      },
      {
        type: "mcq",
        question:
          "What happens to the angular velocity of a rotating object if no external torque is applied?",
        options: ["Increases", "Decreases", "Remains constant", "Becomes zero"],
        correct: 2,
        solution:
          "// Solution: In the absence of external torque, the angular velocity of a rotating object remains constant due to the conservation of angular momentum. Therefore, the correct answer is 'Remains constant.'",
      },
      {
        type: "num",
        question:
          "A wheel starts from rest and accelerates uniformly to an angular velocity of 8 rad/s in 4 seconds. Calculate its angular acceleration.",
        correct: "2 rad/s²",
        solution:
          "// Solution: Angular acceleration (α) is given by α = (change in angular velocity) / (time)\n// Substituting change in angular velocity = 8 rad/s and time = 4 s\n// α = 8 / 4 = 2 rad/s²\n// Therefore, the correct answer is '2 rad/s².'",
      },
      {
        type: "mcq",
        question:
          "In rotational motion, what is the relationship between torque and angular acceleration?",
        options: [
          "Torque = Angular acceleration",
          "Torque = Angular acceleration / Moment of inertia",
          "Torque = Moment of inertia / Angular acceleration",
          "Torque = Moment of inertia * Angular acceleration",
        ],
        correct: 3,
        solution:
          "// Solution: The relationship between torque (τ), moment of inertia (I), and angular acceleration (α) is given by τ = I * α. Therefore, the correct answer is 'Torque = Moment of inertia * Angular acceleration.'",
      },
      {
        type: "num",
        question:
          "A flywheel with a moment of inertia of 0.5 kg·m² is subjected to a torque of 6 N·m. Calculate the angular acceleration of the flywheel.",
        correct: "12 rad/s²",
        solution:
          "// Solution: Angular acceleration (α) is given by τ / I\n// Substituting τ = 6 N·m and I = 0.5 kg·m²\n// α = 6 / 0.5 = 12 rad/s²\n// Therefore, the correct answer is '12 rad/s².'",
      },
    ],

    Optics: [
      {
        type: "mcq",
        question:
          "What is the phenomenon responsible for the formation of a rainbow?",
        options: ["Refraction", "Reflection", "Dispersion", "Diffraction"],
        correct: 2,
        solution:
          "// Solution: The formation of a rainbow is due to the dispersion of light, where different colors are separated as they pass through water droplets in the atmosphere. Therefore, the correct answer is 'Dispersion.'",
      },
      {
        type: "num",
        question:
          "A concave lens has a focal length of -10 cm. Calculate the power of the lens in diopters.",
        correct: "-10 D",
        solution:
          "// Solution: Power (P) of a lens is given by P = 1 / focal length\n// Substituting focal length = -10 cm (negative for concave lens)\n// P = 1 / (-10) = -0.1 D\n// Therefore, the correct answer is '-0.1 D.'",
      },
      {
        type: "mcq",
        question: "Which type of lens converges light to a single point?",
        options: [
          "Concave lens",
          "Convex lens",
          "Plano-concave lens",
          "Plano-convex lens",
        ],
        correct: 3,
        solution:
          "// Solution: A converging lens that brings light to a single point is a convex lens. Plano-convex lenses have one flat and one convex surface. Therefore, the correct answer is 'Plano-convex lens.'",
      },
      {
        type: "num",
        question:
          "If the angle of incidence is 30 degrees, calculate the angle of reflection using the law of reflection.",
        correct: "30 degrees",
        solution:
          "// Solution: According to the law of reflection, the angle of incidence is equal to the angle of reflection. Therefore, the correct answer is '30 degrees.'",
      },
      {
        type: "mcq",
        question: "What type of lens is used to correct nearsightedness?",
        options: [
          "Concave lens",
          "Convex lens",
          "Diverging lens",
          "Bifocal lens",
        ],
        correct: 2,
        solution:
          "// Solution: Nearsightedness is corrected by using a diverging or concave lens. Therefore, the correct answer is 'Convex lens.'",
      },
      {
        type: "num",
        question:
          "A beam of light passes from air into glass. If the angle of incidence is 45 degrees and the refractive index of glass is 1.5, calculate the angle of refraction using Snell's Law.",
        correct: "30 degrees",
        solution:
          "// Solution: Snell's Law is given by n1 * sin(θ1) = n2 * sin(θ2)\n// Substituting n1 = 1 (air), θ1 = 45 degrees, n2 = 1.5 (glass)\n// sin(θ2) = (1 * sin(45)) / 1.5\n// Solving for θ2, θ2 = arcsin(0.5) ≈ 30 degrees\n// Therefore, the correct answer is '30 degrees.'",
      },
      {
        type: "mcq",
        question:
          "What happens to the focal length of a convex lens when it is immersed in water?",
        options: [
          "Increases",
          "Decreases",
          "Remains unchanged",
          "Becomes infinite",
        ],
        correct: 0,
        solution:
          "// Solution: When a convex lens is immersed in a medium with a higher refractive index (like water), its focal length increases. Therefore, the correct answer is 'Increases.'",
      },
      {
        type: "num",
        question:
          "If a diverging lens has a focal length of -15 cm, calculate its power in diopters.",
        correct: "6.67 D",
        solution:
          "// Solution: Power (P) of a lens is given by P = 1 / focal length\n// Substituting focal length = -15 cm (negative for diverging lens)\n// P = 1 / (-15) ≈ -0.067\n// Therefore, the correct answer is '-6.67 D.'",
      },
      {
        type: "mcq",
        question:
          "Which type of mirror can form both real and virtual images, depending on the object distance?",
        options: [
          "Concave mirror",
          "Convex mirror",
          "Plane mirror",
          "Spherical mirror",
        ],
        correct: 0,
        solution:
          "// Solution: A concave mirror can form both real and virtual images depending on the object distance. Therefore, the correct answer is 'Concave mirror.'",
      },
      {
        type: "num",
        question:
          "A lens has a focal length of 20 cm. Calculate its magnification when an object is placed 10 cm from the lens.",
        correct: "-2",
        solution:
          "// Solution: Magnification (m) is given by m = -f / (f - d_o)\n// Substituting focal length (f) = 20 cm and object distance (d_o) = 10 cm\n// m = -20 / (20 - 10) = -2\n// Therefore, the correct answer is '-2.'",
      },
    ],

    "Simple Harmonic Motion": [
      {
        type: "mcq",
        question:
          "What is the defining characteristic of Simple Harmonic Motion (SHM)?",
        options: [
          "Constant speed",
          "Linear motion",
          "Oscillatory motion",
          "Circular motion",
        ],
        correct: 2,
        solution:
          "// Solution: The defining characteristic of Simple Harmonic Motion (SHM) is oscillatory motion, where the restoring force is directly proportional to the displacement from the equilibrium position. Therefore, the correct answer is 'Oscillatory motion.'",
      },
      {
        type: "num",
        question:
          "A mass-spring system has a spring constant of 200 N/m. If the mass attached is 0.5 kg, calculate the angular frequency of the system.",
        correct: "20 rad/s",
        solution:
          "// Solution: Angular frequency (ω) is given by ω = √(k / m)\n// Substituting k = 200 N/m and m = 0.5 kg\n// ω = √(200 / 0.5) = 20 rad/s\n// Therefore, the correct answer is '20 rad/s.'",
      },
      {
        type: "mcq",
        question:
          "In SHM, what is the phase difference between displacement and acceleration?",
        options: ["0 degrees", "180 degrees", "90 degrees", "45 degrees"],
        correct: 1,
        solution:
          "// Solution: In Simple Harmonic Motion (SHM), the displacement and acceleration are 180 degrees out of phase. Therefore, the correct answer is '180 degrees.'",
      },
      {
        type: "num",
        question:
          "If the amplitude of an oscillating object is 0.2 meters and its maximum speed is 2 m/s, calculate its maximum kinetic energy.",
        correct: "0.2 J",
        solution:
          "// Solution: Maximum kinetic energy (KE) in SHM is given by KE_max = (1/2) * m * ω^2 * A^2\n// Given A = 0.2 meters, v_max = 2 m/s, m = mass\n// ω = 2π * f, where f is the frequency\n// Assuming f = 1 Hz, ω = 2π\n// KE_max = (1/2) * m * (2π)^2 * (0.2)^2\n// KE_max ≈ 0.2 J\n// Therefore, the correct answer is '0.2 J.'",
      },
      {
        type: "mcq",
        question:
          "What is the relationship between the period (T) and frequency (f) in SHM?",
        options: ["T = f", "T = 1/f", "T = 2π/f", "T = f/2π"],
        correct: 1,
        solution:
          "// Solution: The relationship between the period (T) and frequency (f) in Simple Harmonic Motion (SHM) is T = 1/f. Therefore, the correct answer is 'T = 1/f.'",
      },
      {
        type: "num",
        question:
          "A simple pendulum has a length of 1 meter. Calculate its period if the acceleration due to gravity is 9.8 m/s².",
        correct: "2.01 s",
        solution:
          "// Solution: The period (T) of a simple pendulum is given by T = 2π * √(l / g)\n// Substituting l = 1 meter and g = 9.8 m/s²\n// T = 2π * √(1 / 9.8) ≈ 2.01 s\n// Therefore, the correct answer is '2.01 s.'",
      },
      {
        type: "mcq",
        question:
          "What is the relationship between the displacement (x) and the restoring force (F) in SHM?",
        options: ["F = kx", "F = k/x", "F = mx^2", "F = k√x"],
        correct: 0,
        solution:
          "// Solution: The relationship between displacement (x) and restoring force (F) in Simple Harmonic Motion (SHM) is F = -kx. Therefore, the correct answer is 'F = kx.'",
      },
      {
        type: "num",
        question:
          "If the amplitude of an oscillating object is doubled, how does this affect its maximum potential energy?",
        correct: "Quadrupled",
        solution:
          "// Solution: Maximum potential energy (PE_max) in SHM is proportional to the square of the amplitude (PE_max ∝ A^2)\n// If the amplitude is doubled, PE_max is quadrupled (2^2 = 4)\n// Therefore, the correct answer is 'Quadrupled.'",
      },
      {
        type: "mcq",
        question:
          "In SHM, where is the maximum speed and minimum potential energy found?",
        options: [
          "At the equilibrium position",
          "At the maximum displacement",
          "At the minimum displacement",
          "At the turning points",
        ],
        correct: 3,
        solution:
          "// Solution: In Simple Harmonic Motion (SHM), the maximum speed and minimum potential energy are found at the turning points (maximum displacement). Therefore, the correct answer is 'At the turning points.'",
      },
      {
        type: "num",
        question:
          "A mass-spring system oscillates with a frequency of 2 Hz. Calculate its angular frequency.",
        correct: "12.57 rad/s",
        solution:
          "// Solution: Angular frequency (ω) is related to frequency (f) by ω = 2π * f\n// Substituting f = 2 Hz\n// ω = 2π * 2 ≈ 12.57 rad/s\n// Therefore, the correct answer is '12.57 rad/s.'",
      },
    ],
  },

  Math: {
    "Complex Numbers": [
      {
        type: "num",
        question:
          "Find the real and imaginary parts of the complex number (4 - i)^2 / (2 + i).",
        correct: "7, -6",
        solution:
          "// Solution: Perform the operations and simplify\n// (4 - i)^2 = (16 - 8i - i^2) = (16 + 8i + 1) = 17 + 8i\n// Now, divide by (2 + i): (17 + 8i) / (2 + i)\n// Multiply by the conjugate to rationalize the denominator\n// [(17 + 8i) * (2 - i)] / [(2 + i) * (2 - i)] = (34 - 17i + 16i - 8i^2) / (5) = (34 - i + 8) / 5\n// Separate into real and imaginary parts: (34 + 8)/5, (-1/5)\n// Therefore, the correct answer is '7, -6.'",
      },
      {
        type: "mcq",
        question:
          "Which complex number lies on the circle centered at the origin with a radius of 5?",
        options: ["3 + 4i", "5 - 12i", "-1 - 2i", "2 + 2i"],
        correct: 0,
        solution:
          "// Solution: The complex number 3 + 4i lies on the circle with radius 5, as its magnitude is √(3^2 + 4^2) = 5.\n// Therefore, the correct answer is '3 + 4i.'",
      },
      {
        type: "num",
        question: "Express the complex number (1 + i)^5 in polar form.",
        correct: "2^2.5∠225°",
        solution:
          "// Solution: Raise (1 + i) to the power of 5, then express in polar form\n// (1 + i)^5 = 2^2.5 * ∠225°\n// Therefore, the correct answer is '2^2.5∠225°.'",
      },
      {
        type: "mcq",
        question:
          "What is the principal value of the argument (angle) for the complex number -3 - 3i?",
        options: ["-45°", "135°", "-135°", "45°"],
        correct: 2,
        solution:
          "// Solution: Calculate the argument (angle) using the arctan function\n// θ = arctan((-3) / (-3)) = arctan(1) = -135°\n// Therefore, the correct answer is '-135°.'",
      },
      {
        type: "num",
        question: "Determine all solutions for the equation z^2 = -1.",
        correct: "i, -i",
        solution:
          "// Solution: Solve the equation by taking the square root of both sides\n// z = ±√(-1) = ±i\n// Therefore, the correct answer is 'i, -i.'",
      },
      {
        type: "mcq",
        question: "Which complex number is the cube root of unity?",
        options: ["1", "-1", "i", "-i"],
        correct: 0,
        solution:
          "// Solution: The cube roots of unity are 1, e^(2πi/3), and e^(4πi/3)\n// Therefore, the correct answer is '1.'",
      },
      {
        type: "num",
        question: "Simplify the expression: (cos π/4 + i sin π/4)^2.",
        correct: "cos π/2 + i sin π/2",
        solution:
          "// Solution: Use De Moivre's Theorem to simplify the expression\n// (cos π/4 + i sin π/4)^2 = cos(2 * π/4) + i sin(2 * π/4) = cos π/2 + i sin π/2\n// Therefore, the correct answer is 'cos π/2 + i sin π/2.'",
      },
      {
        type: "mcq",
        question: "What is the modulus of the complex number -5 - 12i?",
        options: ["5", "12", "13", "17"],
        correct: 2,
        solution:
          "// Solution: The modulus (magnitude) is given by √((-5)^2 + (-12)^2) = √(25 + 144) = √169 = 13\n// Therefore, the correct answer is '13.'",
      },
      {
        type: "num",
        question: "Find all solutions for the equation z^4 = 1.",
        correct: "1, -1, i, -i",
        solution:
          "// Solution: The solutions can be found by considering the roots of unity\n// z = e^(2πik/4) for k = 0, 1, 2, 3\n// Therefore, the correct answer is '1, -1, i, -i.'",
      },
      {
        type: "mcq",
        question:
          "Which complex number lies in the first quadrant of the complex plane?",
        options: ["2 - 3i", "3 + 4i", "-5 + 2i", "-1 - i"],
        correct: 1,
        solution:
          "// Solution: The complex number 3 + 4i lies in the first quadrant as both the real and imaginary parts are positive.\n// Therefore, the correct answer is '3 + 4i.'",
      },
    ],

    "Integral Calculus": [
      {
        type: "num",
        question: "Evaluate the definite integral: ∫(2x + 3) dx from 1 to 4.",
        correct: "33",
        solution:
          "// Solution: Integrate (2x + 3) with respect to x, then evaluate from 1 to 4\n// ∫(2x + 3) dx = x^2 + 3x + C\n// Evaluate at upper limit (4): (4)^2 + 3(4) - (1^2 + 3(1)) = 33\n// Therefore, the correct answer is '33.'",
      },
      {
        type: "mcq",
        question: "Which of the following is the antiderivative of e^x?",
        options: ["e^x", "ln|x|", "cos x", "sin x"],
        correct: 0,
        solution:
          "// Solution: The antiderivative of e^x is e^x\n// Therefore, the correct answer is 'e^x.'",
      },
      {
        type: "num",
        question:
          "Calculate the definite integral: ∫(4x^3 - 2x) dx from -1 to 2.",
        correct: "30",
        solution:
          "// Solution: Integrate (4x^3 - 2x) with respect to x, then evaluate from -1 to 2\n// ∫(4x^3 - 2x) dx = x^4 - x^2 + C\n// Evaluate at upper limit (2) and lower limit (-1): (2)^4 - (2)^2 - ((-1)^4 - (-1)^2) = 30\n// Therefore, the correct answer is '30.'",
      },
      {
        type: "mcq",
        question: "What is the derivative of the function F(x) = ∫(3x^2) dx?",
        options: ["x^3", "3x^2", "x^2", "e^x"],
        correct: 1,
        solution:
          "// Solution: The derivative of F(x) = ∫(3x^2) dx with respect to x is 3x^2\n// Therefore, the correct answer is '3x^2.'",
      },
      {
        type: "num",
        question:
          "Find the area under the curve y = 2x + 1 from x = 1 to x = 3.",
        correct: "10",
        solution:
          "// Solution: Integrate the function (2x + 1) from 1 to 3 to find the area under the curve\n// ∫(2x + 1) dx from 1 to 3 = (x^2 + x) evaluated from 1 to 3 = 10\n// Therefore, the correct answer is '10.'",
      },
      {
        type: "mcq",
        question: "Which of the following is the antiderivative of cos(x)?",
        options: ["sin(x)", "-sin(x)", "tan(x)", "cot(x)"],
        correct: 0,
        solution:
          "// Solution: The antiderivative of cos(x) is sin(x)\n// Therefore, the correct answer is 'sin(x).'",
      },
      {
        type: "num",
        question: "Evaluate the improper integral: ∫(1/x) dx from 1 to ∞.",
        correct: "∞",
        solution:
          "// Solution: Integrate (1/x) with respect to x from 1 to ∞ as an improper integral\n// ∫(1/x) dx from 1 to ∞ = ln(x) evaluated from 1 to ∞ = ∞\n// Therefore, the correct answer is '∞.'",
      },
      {
        type: "mcq",
        question:
          "What is the area between the curves y = x^2 and y = 2x from x = 0 to x = 2?",
        options: ["4", "8", "12", "16"],
        correct: 1,
        solution:
          "// Solution: Find the points of intersection and then integrate the difference of the curves\n// ∫(2x - x^2) dx from 0 to 2 = (x^2 - (x^3)/3) evaluated from 0 to 2 = 8/3\n// Therefore, the correct answer is '8.'",
      },
      {
        type: "num",
        question:
          "Calculate the definite integral: ∫(e^(2x) + 3) dx from 0 to 1.",
        correct: "7.434",
        solution:
          "// Solution: Integrate (e^(2x) + 3) with respect to x, then evaluate from 0 to 1\n// ∫(e^(2x) + 3) dx = (1/2)e^(2x) + 3x evaluated from 0 to 1 ≈ 7.434\n// Therefore, the correct answer is '7.434.'",
      },
      {
        type: "mcq",
        question:
          "What is the average value of the function f(x) = x^2 on the interval [0, 2]?",
        options: ["1", "2", "4/3", "8/3"],
        correct: 2,
        solution:
          "// Solution: The average value of f(x) on the interval [a, b] is given by (1/(b - a)) ∫f(x) dx from a to b\n// For f(x) = x^2 on [0, 2]: (1/(2 - 0)) ∫x^2 dx from 0 to 2 = 4/3\n// Therefore, the correct answer is '4/3.'",
      },
    ],

    Trignometry: [
      {
        type: "num",
        question: "Solve for x in the equation 2sin^2(x) - 3cos(x) + 1 = 0.",
        correct: "[pi/3, 5pi/3]",
        solution:
          "// Solution: Rearrange the equation and solve using trigonometric identities\n// 2sin^2(x) - 3cos(x) + 1 = 0\n// Rewrite sin^2(x) in terms of cos(x) using the identity sin^2(x) + cos^2(x) = 1\n// 2(1 - cos^2(x)) - 3cos(x) + 1 = 0\n// Simplify and solve the quadratic equation for cos(x)\n// The solutions are cos(x) = 1/2 and cos(x) = -1/3\n// Therefore, x = pi/3, 5pi/3\n// Therefore, the correct answer is '[pi/3, 5pi/3].' ",
      },
      {
        type: "mcq",
        question: "What is the period of the function y = 2sin(3x)cos(2x)?",
        options: ["pi/2", "2pi/3", "2pi", "3pi/2"],
        correct: "2pi",
        solution:
          "// Solution: The period of y = A sin(Bx) cos(Cx) is given by 2pi/(|B| + |C|)\n// In this case, the period is 2pi/(3 + 2) = 2pi/5\n// Therefore, the correct answer is '2pi.'",
      },
      {
        type: "num",
        question:
          "If tan(A) = sqrt(3) and A is in the second quadrant, what is the value of cos(A)?",
        correct: "-1/2",
        solution:
          "// Solution: In the second quadrant, cosine is negative. Use the identity tan(A) = sin(A)/cos(A)\n// sqrt(3) = sin(A)/cos(A)\n// Therefore, cos(A) = -1/2\n// Therefore, the correct answer is '-1/2.'",
      },
      {
        type: "mcq",
        question: "Evaluate the integral ∫(cos^2(x)sin(x)) dx.",
        options: [
          "(1/3)cos^3(x) + C",
          "(1/2)cos^2(x) + C",
          "(1/4)cos^4(x) + C",
          "cos(x)sin(x) + C",
        ],
        correct: "(1/2)cos^2(x) + C",
        solution:
          "// Solution: Use integration techniques to evaluate the integral\n// ∫(cos^2(x)sin(x)) dx = (1/2)cos^2(x) + C\n// Therefore, the correct answer is '(1/2)cos^2(x) + C.'",
      },
      {
        type: "num",
        question:
          "If sec(A) = 2 and A is in the third quadrant, what is the value of tan(A)?",
        correct: "-sqrt(3)",
        solution:
          "// Solution: In the third quadrant, tangent is negative. Use the identity sec^2(A) = 1 + tan^2(A)\n// (1/4) = 1 + tan^2(A)\n// tan^2(A) = -3\n// Therefore, tan(A) = -sqrt(3)\n// Therefore, the correct answer is '-sqrt(3).'",
      },
      {
        type: "mcq",
        question:
          "Find the general solution to the equation 2sin^2(x) - sin(x) - 1 = 0.",
        options: [
          "[pi/3 + 2pi n, 5pi/3 + 2pi n]",
          "[pi/6 + pi n, 7pi/6 + pi n]",
          "[2pi/3 + 2pi n, 4pi/3 + 2pi n]",
          "[pi/4 + pi n, 3pi/4 + pi n]",
        ],
        correct: "[pi/3 + 2pi n, 5pi/3 + 2pi n]",
        solution:
          "// Solution: Solve the quadratic equation for sin(x)\n// 2sin^2(x) - sin(x) - 1 = 0\n// (2sin(x) + 1)(sin(x) - 1) = 0\n// sin(x) = -1/2 or sin(x) = 1\n// Therefore, the general solution is [pi/3 + 2pi n, 5pi/3 + 2pi n].",
      },
      {
        type: "num",
        question:
          "If cos(A) = -1/3 and A is in the fourth quadrant, what is the value of sin(A)?",
        correct: "-2sqrt(2)/3",
        solution:
          "// Solution: In the fourth quadrant, sine is negative. Use the identity cos^2(A) + sin^2(A) = 1\n// (-1/3)^2 + sin^2(A) = 1\n// sin^2(A) = 8/9\n// Therefore, sin(A) = -2sqrt(2)/3\n// Therefore, the correct answer is '-2sqrt(2)/3.'",
      },
    ],

    "Cooridnate Geometry": [
      {
        type: "mcq",
        question:
          "If point A has coordinates (3, -4) and point B has coordinates (-2, 5), what is the distance AB?",
        options: ["5", "7", "10", "√74"],
        correct: 3,
        solution:
          "// Solution: Use the distance formula: d = √((x2 - x1)^2 + (y2 - y1)^2)\n// d = √((-2 - 3)^2 + (5 - (-4))^2) = √74\n// Therefore, the correct answer is '√74.'",
      },
      {
        type: "num",
        question:
          "Find the midpoint of the line segment with endpoints (1, 2) and (5, -6).",
        correct: "(3, -2)",
        solution:
          "// Solution: Midpoint coordinates (mx, my) are given by:\n// mx = (x1 + x2) / 2\n// my = (y1 + y2) / 2\n// (3, -2) is the midpoint of (1, 2) and (5, -6).",
      },
      {
        type: "mcq",
        question:
          "If the points A(2, 3), B(5, -1), and C(-1, 4) form a triangle, what type of triangle is it?",
        options: ["Equilateral", "Isosceles", "Scalene", "Right-angled"],
        correct: 2,
        solution:
          "// Solution: Calculate the distances between the three pairs of points.\n// AB = √((5 - 2)^2 + (-1 - 3)^2) = 5\n// BC = √((-1 - 5)^2 + (4 - (-1))^2) = 7.81\n// AC = √((2 - (-1))^2 + (3 - 4)^2) = 3.16\n// Since all three sides have different lengths, the triangle is isosceles.",
      },
      {
        type: "num",
        question:
          "Find the equation of the line passing through the points (2, -3) and (4, 5).",
        correct: "y = 4x - 11",
        solution:
          "// Solution: Use the point-slope form: y - y1 = m(x - x1)\n// m is the slope, calculated as (y2 - y1) / (x2 - x1)\n// m = (5 - (-3)) / (4 - 2) = 4\n// Substitute one of the points (e.g., (2, -3)) into the equation: y - (-3) = 4(x - 2)\n// Simplify to get the equation: y = 4x - 11",
      },
      {
        type: "mcq",
        question: "The line 3x - 4y = 12 passes through which quadrant(s)?",
        options: ["Quadrant I", "Quadrant II", "Quadrant III", "Quadrant IV"],
        correct: [1, 3],
        solution:
          "// Solution: Substitute x = 4 and y = 0 (on the x-axis) into the equation: 3(4) - 4(0) = 12\n// Substitute x = 0 and y = -3 (on the y-axis) into the equation: 3(0) - 4(-3) = 12\n// The line passes through Quadrant I and Quadrant III.",
      },
      {
        type: "num",
        question:
          "If the slope of a line is -2 and it passes through the point (3, 1), find the y-intercept.",
        correct: "7",
        solution:
          "// Solution: Use the point-slope form: y - y1 = m(x - x1)\n// Substitute m = -2 and (x1, y1) = (3, 1) into the equation\n// Simplify to get the equation: y = -2x + 7\n// The y-intercept is 7.",
      },
      {
        type: "mcq",
        question:
          "What is the area of the triangle formed by the points (1, 2), (4, -3), and (-2, 1)?",
        options: ["6", "9", "12", "15"],
        correct: 1,
        solution:
          "// Solution: Use the Shoelace Formula to calculate the area of a triangle given its vertices.\n// Area = 0.5 * |(1 * (-3) + 4 * 1 + (-2) * 2) - (2 * 4 + (-3) * (-2) + 1 * 1)|\n// Area = 6\n// Therefore, the correct answer is '6.'",
      },
      {
        type: "num",
        question:
          "Determine the equation of the circle with center (2, -1) and radius 3.",
        correct: "(x - 2)^2 + (y + 1)^2 = 9",
        solution:
          "// Solution: The standard form of the equation of a circle is (x - h)^2 + (y - k)^2 = r^2\n// Substitute the center (h, k) = (2, -1) and radius r = 3 into the equation.\n// The equation is (x - 2)^2 + (y",
      },
    ],
  },

  Chemistry: {
    "Structure Of Atom": [
      {
        type: "mcq",
        question: "Who proposed the planetary model of the atom?",
        options: [
          "J.J. Thomson",
          "Niels Bohr",
          "Erwin Schrödinger",
          "John Dalton",
        ],
        correct: 1,
        solution:
          "// Solution: Niels Bohr proposed the planetary model of the atom.",
      },
      {
        type: "num",
        question: "What is the charge of an electron?",
        correct: "-1",
        solution: "// Solution: An electron has a charge of -1.",
      },
      {
        type: "mcq",
        question: "What is the mass of a proton?",
        options: ["1 amu", "1836 amu", "0 amu", "Approximately 1/1836 amu"],
        correct: 0,
        solution:
          "// Solution: The mass of a proton is approximately 1 atomic mass unit (amu).",
      },
      {
        type: "num",
        question:
          "How many electrons can occupy the first energy level (n=1) in an atom?",
        correct: "2",
        solution:
          "// Solution: The first energy level (n=1) can hold a maximum of 2 electrons.",
      },
      {
        type: "mcq",
        question: "Who discovered the neutron?",
        options: [
          "J.J. Thomson",
          "Niels Bohr",
          "James Chadwick",
          "Ernest Rutherford",
        ],
        correct: 2,
        solution: "// Solution: James Chadwick discovered the neutron.",
      },
      {
        type: "num",
        question:
          "What is the maximum number of electrons that can occupy the p sublevel?",
        correct: "6",
        solution:
          "// Solution: The p sublevel can hold a maximum of 6 electrons.",
      },
      {
        type: "mcq",
        question: "Which quantum number represents the shape of an orbital?",
        options: [
          "Principal quantum number (n)",
          "Angular momentum quantum number (l)",
          "Magnetic quantum number (m)",
          "Spin quantum number (s)",
        ],
        correct: 1,
        solution:
          "// Solution: The Angular momentum quantum number (l) represents the shape of an orbital.",
      },
      {
        type: "num",
        question:
          "What is the electron configuration of oxygen (O) in its ground state?",
        correct: "1s² 2s² 2p⁴",
        solution:
          "// Solution: The electron configuration of oxygen in its ground state is 1s² 2s² 2p⁴.",
      },
      {
        type: "mcq",
        question:
          "Which element has the electron configuration 1s² 2s² 2p⁶ 3s² 3p⁶ 4s¹?",
        options: ["Carbon (C)", "Oxygen (O)", "Sodium (Na)", "Chlorine (Cl)"],
        correct: 2,
        solution:
          "// Solution: Sodium (Na) has the electron configuration 1s² 2s² 2p⁶ 3s² 3p⁶ 4s¹.",
      },
      {
        type: "num",
        question: "What is the symbol for the element with atomic number 16?",
        correct: "S",
        solution:
          "// Solution: The element with atomic number 16 is sulfur (S).",
      },
    ],

    "Chemical Bonding": [
      {
        type: "mcq",
        question: "In a covalent bond, what is being shared between two atoms?",
        options: ["Electrons", "Protons", "Neutrons", "Positrons"],
        correct: 0,
        solution:
          "// Solution: In a covalent bond, electrons are shared between two atoms.",
      },
      {
        type: "num",
        question: "How many valence electrons does an oxygen atom have?",
        correct: "6",
        solution:
          "// Solution: Oxygen, with atomic number 8, has 6 valence electrons.",
      },
      {
        type: "mcq",
        question:
          "What type of bond is formed between a metal and a non-metal?",
        options: [
          "Ionic bond",
          "Covalent bond",
          "Metallic bond",
          "Polar covalent bond",
        ],
        correct: 0,
        solution:
          "// Solution: A bond between a metal and a non-metal is an ionic bond.",
      },
      {
        type: "num",
        question:
          "How many lone pairs of electrons are there in a water molecule (H2O)?",
        correct: "2",
        solution: "// Solution: Water (H2O) has two lone pairs of electrons.",
      },
      {
        type: "mcq",
        question: "Which of the following molecules is nonpolar?",
        options: ["HCl", "CO2", "NH3", "CH4"],
        correct: 3,
        solution:
          "// Solution: Methane (CH4) is nonpolar because of its symmetrical tetrahedral structure.",
      },
      {
        type: "num",
        question: "What is the bond angle in a methane (CH4) molecule?",
        correct: "109.5 degrees",
        solution:
          "// Solution: The bond angle in methane (CH4) is approximately 109.5 degrees.",
      },
      {
        type: "mcq",
        question:
          "Which type of bond involves the sharing of electrons with a significant difference in electronegativity?",
        options: [
          "Ionic bond",
          "Covalent bond",
          "Metallic bond",
          "Polar covalent bond",
        ],
        correct: 3,
        solution:
          "// Solution: A polar covalent bond involves the sharing of electrons with a significant electronegativity difference.",
      },
      {
        type: "num",
        question: "How many sigma (σ) bonds are there in a triple bond?",
        correct: "1",
        solution: "// Solution: In a triple bond, there is one sigma (σ) bond.",
      },
      {
        type: "mcq",
        question:
          "Which of the following molecules has a trigonal planar molecular geometry?",
        options: ["BF3", "NH3", "CH4", "H2O"],
        correct: 0,
        solution:
          "// Solution: Boron trifluoride (BF3) has a trigonal planar molecular geometry.",
      },
      {
        type: "num",
        question:
          "What is the hybridization of the carbon atom in methane (CH4)?",
        correct: "sp3",
        solution:
          "// Solution: The carbon atom in methane (CH4) undergoes sp3 hybridization.",
      },
    ],

    "Chemical Equilibrium": [
      {
        type: "mcq",
        question:
          "Which statement about a system at chemical equilibrium is true?",
        options: [
          "The concentrations of reactants and products remain constant.",
          "The reaction has stopped.",
          "The forward reaction rate equals the reverse reaction rate.",
          "The reaction has reached completion.",
        ],
        correct: 2,
        solution:
          "// Solution: At chemical equilibrium, the forward reaction rate equals the reverse reaction rate.",
      },
      {
        type: "num",
        question:
          "What is the equilibrium constant (Kc) expression for the reaction: \nN2(g) + 3H2(g) ⇌ 2NH3(g)?",
        correct: "[NH3]^2 / [N2] [H2]^3",
        solution:
          "// Solution: The equilibrium constant expression (Kc) for the reaction is [NH3]^2 / [N2] [H2]^3.",
      },
      {
        type: "mcq",
        question:
          "How does an increase in temperature affect an exothermic reaction at equilibrium?",
        options: [
          "Shifts the equilibrium to the left.",
          "Shifts the equilibrium to the right.",
          "Has no effect on the equilibrium position.",
          "Causes the reaction to stop.",
        ],
        correct: 0,
        solution:
          "// Solution: For an exothermic reaction, an increase in temperature shifts the equilibrium to the left.",
      },
      {
        type: "num",
        question:
          "What is the effect of adding an inert gas at constant volume to a system at equilibrium?",
        correct: "No effect on the equilibrium position.",
        solution:
          "// Solution: Adding an inert gas at constant volume has no effect on the equilibrium position.",
      },
      {
        type: "mcq",
        question:
          "Which factor does NOT affect the value of the equilibrium constant (Kc)?",
        options: [
          "Temperature",
          "Pressure",
          "Concentration of reactants and products",
          "Catalysts",
        ],
        correct: 3,
        solution:
          "// Solution: Catalysts do not affect the value of the equilibrium constant (Kc).",
      },
      {
        type: "num",
        question: "What is the Le Chatelier's principle?",
        correct:
          "If a system at equilibrium is subjected to a change, the system will adjust itself to counteract that change.",
        solution:
          "// Solution: Le Chatelier's principle states that if a system at equilibrium is subjected to a change, the system will adjust itself to counteract that change.",
      },
      {
        type: "mcq",
        question:
          "What is the effect of decreasing the volume on a system at equilibrium for a reaction with fewer moles of gas on the reactant side?",
        options: [
          "Shifts the equilibrium to the left.",
          "Shifts the equilibrium to the right.",
          "Has no effect on the equilibrium position.",
          "Causes the reaction to stop.",
        ],
        correct: 1,
        solution:
          "// Solution: Decreasing the volume on a system at equilibrium with fewer moles of gas on the reactant side shifts the equilibrium to the right.",
      },
      {
        type: "num",
        question:
          "In the Haber process, nitrogen and hydrogen react to form ammonia. If more nitrogen is added to the system, what happens to the concentration of ammonia at equilibrium?",
        correct: "Increases",
        solution:
          "// Solution: If more nitrogen is added, the concentration of ammonia at equilibrium increases (shifts to the right).",
      },
      {
        type: "mcq",
        question: "What does a large equilibrium constant (Kc) indicate?",
        options: [
          "The reaction favors the reactants.",
          "The reaction favors the products.",
          "The reaction has stopped.",
          "The concentration of reactants and products is equal.",
        ],
        correct: 1,
        solution:
          "// Solution: A large equilibrium constant (Kc) indicates that the reaction favors the products.",
      },
      {
        type: "num",
        question:
          "What is the relationship between the rate of the forward reaction and the rate of the reverse reaction at equilibrium?",
        correct: "Equal",
        solution:
          "// Solution: At equilibrium, the rate of the forward reaction equals the rate of the reverse reaction.",
      },
    ],

    "Ionic Equilibrium": [
      {
        type: "mcq",
        question:
          "What is the definition of the term 'common ion effect' in ionic equilibrium?",
        options: [
          "The increase in solubility of a sparingly soluble salt in the presence of a common ion.",
          "The decrease in solubility of a sparingly soluble salt in the presence of a common ion.",
          "The increase in ionization of a weak electrolyte in the presence of a common ion.",
          "The decrease in ionization of a weak electrolyte in the presence of a common ion.",
        ],
        correct: 1,
        solution:
          "// Solution: The common ion effect refers to the decrease in solubility of a sparingly soluble salt in the presence of a common ion.",
      },
      {
        type: "num",
        question:
          "Calculate the pH of a solution with a hydroxide ion concentration of 1 x 10^(-8) M.",
        correct: "8",
        solution:
          "// Solution: The pH of a solution is given by -log[H⁺]. For a hydroxide ion concentration of 1 x 10^(-8) M, the pH is 8.",
      },
      {
        type: "mcq",
        question: "Which of the following is a strong acid?",
        options: [
          "CH3COOH (Acetic acid)",
          "HCl (Hydrochloric acid)",
          "H2CO3 (Carbonic acid)",
          "HF (Hydrofluoric acid)",
        ],
        correct: 1,
        solution: "// Solution: HCl (Hydrochloric acid) is a strong acid.",
      },
      {
        type: "num",
        question:
          "Calculate the pOH of a solution with a hydronium ion concentration of 1 x 10^(-4) M.",
        correct: "4",
        solution:
          "// Solution: The pOH of a solution is given by -log[OH⁻]. For a hydronium ion concentration of 1 x 10^(-4) M, the pOH is 4.",
      },
      {
        type: "mcq",
        question:
          "What is the pH of a solution with a hydronium ion concentration of 1 x 10^(-2) M?",
        options: ["2", "4", "6", "8"],
        correct: 0,
        solution:
          "// Solution: The pH of a solution is given by -log[H⁺]. For a hydronium ion concentration of 1 x 10^(-2) M, the pH is 2.",
      },
      {
        type: "num",
        question:
          "Calculate the hydroxide ion concentration in a solution with a pH of 9.",
        correct: "1 x 10^(-5) M",
        solution:
          "// Solution: The hydroxide ion concentration can be calculated using the formula [OH⁻] = 10^(-pOH). For a pH of 9, [OH⁻] is 1 x 10^(-5) M.",
      },
      {
        type: "mcq",
        question: "Which of the following is a weak base?",
        options: [
          "NaOH (Sodium hydroxide)",
          "KOH (Potassium hydroxide)",
          "NH3 (Ammonia)",
          "Ca(OH)2 (Calcium hydroxide)",
        ],
        correct: 2,
        solution: "// Solution: NH3 (Ammonia) is a weak base.",
      },
      {
        type: "num",
        question:
          "Calculate the percent ionization of a weak acid if its initial concentration is 0.1 M, and the equilibrium concentration of H⁺ ions is 1 x 10^(-4) M.",
        correct: "0.1%",
        solution:
          "// Solution: Percent ionization = (H⁺ ion concentration at equilibrium / Initial acid concentration) * 100\n// Percent ionization = (1 x 10^(-4) / 0.1) * 100 = 0.1%",
      },
      {
        type: "mcq",
        question:
          "What happens to the pH of a solution when a strong acid is added?",
        options: [
          "Increases",
          "Decreases",
          "Remains unchanged",
          "Becomes neutral",
        ],
        correct: 1,
        solution:
          "// Solution: When a strong acid is added, the pH of the solution decreases.",
      },
      {
        type: "num",
        question:
          "Determine the pH of a solution with a hydrogen ion concentration of 1 x 10^(-9) M.",
        correct: "9",
        solution:
          "// Solution: The pH of a solution is given by -log[H⁺]. For a hydrogen ion concentration of 1 x 10^(-9) M, the pH is 9.",
      },
    ],
  },
};

function Tests() {
  // create test button pops up an MUI Autocomplete which has the following options: ["Work Power Energy", "Center Of Mass Momentum and Collision", "Rotational Motion", "Gravitation", "Mechanical Properties of Fluids", "Complex Numbers", "Trigonometric Ratios and Identities", "Straight Lines", "Ellipse", "Parabola", "Hyperbola", "Structure of Atom", "Periodic Classification of Elements", "Chemical Equilibrium", "Ionic Equilibrium", "General Organic Chemistry"]

  // when user creates the test with some topics selected, it should pass that to firestore and fetch questions from the provided topics
  // database format = phsx: {topic1:questions:[{type:'', question:'', options:[], correct}]}, math: {topic1:questions:[{type:'', question:'', options:[], correct}]}, chem: {topic1:questions:[{type:'', question:'', options:[], correct}]}
  // some might not have options so they only have type, question and correct
  // console.log all questions

  // create test with random questions
  // RenderTest component
  // Validate component

  const phsxTopics = [
    "Optics",
    "Work Power Energy",
    "Circular Motion",
    "Rotational Motion",
    "Simple Harmonic Motion",
  ];
  const mathTopics = [
    "Complex Numbers",
    "Trignometry",
    "Cooridnate Geometry",
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

    // Get and shuffle math questions
    const mathQuestions = shuffleArray(
      getQuestions("Math", selectedMathTopics)
    ).slice(0, 4);
    setSelectedMathQuestions(mathQuestions);

    // Get and shuffle physics questions
    const phsxQuestions = shuffleArray(
      getQuestions("Physics", selectedPhsxTopics)
    ).slice(0, 4);
    setSelectedPhsxQuestions(phsxQuestions);

    // Get and shuffle chemistry questions
    const chemQuestions = shuffleArray(
      getQuestions("Chemistry", selectedChemTopics)
    ).slice(0, 4);
    setSelectedChemQuestions(chemQuestions);

    // Additional logic for rendering the questions will be added later
    setTestCreated(true);
  };

  console.log(
    selectedMathQuestions,
    selectedChemQuestions,
    selectedPhsxQuestions
  );

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handlePrevQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
  };

  const handleOptionSelect = (selectedOption) => {
    // Handle logic to store user responses based on the selected option
    // You might want to update the userResponses state accordingly
  };

  const renderQuestion = () => {
    const currentSubject = "Math"; // You can change this based on the current subject
    const currentQuestions =
      currentSubject === "Math"
        ? selectedMathQuestions
        : currentSubject === "Physics"
        ? selectedPhsxQuestions
        : selectedChemQuestions;

    if (currentQuestions.length === 0) {
      // Render a message indicating that there are no questions available
      return <div>No questions available for the selected topics.</div>;
    }

    const currentQuestion = currentQuestions[currentQuestionIndex];
    const { type, question, options, correct } = currentQuestion;
    return (
      <MDBox>
        <MDBox>
          <MDTypography variant="subtitle1">{question}</MDTypography>
        </MDBox>
        {type === "mcq" ? (
          <MDBox>
            {options.map((option, index) => (
              <MDButton key={index} onClick={() => handleOptionSelect(index)}>
                {option}
              </MDButton>
            ))}
          </MDBox>
        ) : (
          <MDBox>
            {/* Render input for numerical type */}
            <MDInput
              type="number"
              onChange={(e) => handleOptionSelect(e.target.value)}
            />
          </MDBox>
        )}
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

  return (
    <DashboardLayout>
      <DashboardNavbar absolute isMini />
      <MDBox mt={8}>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            {testCreated ? (
              <Grid item xs={12} lg={8}>
                {renderQuestion()}
              </Grid>
            ) : (
              <Grid item xs={12} lg={8}>
                <Grid container spacing={3}>
                  <Grid item xs={12} xl={6}>
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
                  <Grid item xs={12} xl={6}>
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
                  <Grid item xs={12} xl={6}>
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
            <Grid item xs={12} lg={4}>
              <MDTypography>Invoices</MDTypography>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}


export default Tests;
