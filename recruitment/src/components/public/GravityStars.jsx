"use client";
import React, { useEffect, useRef } from "react";

export const GravityStars = ({ className = "" }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let animationFrameId;

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const stars = [];
        const STAR_COUNT = 100;
        const CONNECTION_DISTANCE = 150;
        const GRAVITY_STRENGTH = 0.05;

        let mouse = { x: width / 2, y: height / 2 };

        class Star {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
                this.color = `rgba(100, 116, 139, ${Math.random() * 0.5 + 0.1})`;
            }

            update() {
                // Gravity effect towards mouse
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                this.distanceToMouse = distance;

                if (distance < 300) {
                    const force = (300 - distance) / 300;
                    this.vx += (dx / distance) * force * GRAVITY_STRENGTH;
                    this.vy += (dy / distance) * force * GRAVITY_STRENGTH;
                }

                // Friction
                this.vx *= 0.98;
                this.vy *= 0.98;

                // Constant separate movement
                if (Math.abs(this.vx) < 0.1) this.vx += (Math.random() - 0.5) * 0.05;
                if (Math.abs(this.vy) < 0.1) this.vy += (Math.random() - 0.5) * 0.05;

                this.x += this.vx;
                this.y += this.vy;

                // Bounce off walls
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

                if (this.distanceToMouse < 100) {
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)'; // Darker when hovered
                } else {
                    ctx.fillStyle = this.color;
                }

                ctx.fill();
            }
        }

        // Initialize stars
        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push(new Star());
        }

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("mousemove", handleMouseMove);

        const animate = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, width, height);

            // Update and draw stars
            stars.forEach(star => {
                star.update();
                star.draw();
            });

            // Draw connections
            for (let i = 0; i < stars.length; i++) {
                for (let j = i + 1; j < stars.length; j++) {
                    const dx = stars[i].x - stars[j].x;
                    const dy = stars[i].y - stars[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < CONNECTION_DISTANCE) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(100, 116, 139, ${0.1 * (1 - distance / CONNECTION_DISTANCE)})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(stars[i].x, stars[i].y);
                        ctx.lineTo(stars[j].x, stars[j].y);
                        ctx.stroke();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className={`block w-full h-full ${className}`} style={{ background: '#ffffff' }} />;
};
