class Background {

    static withGlow() {
        let circle = (x, y, radius, color) => {
            starsctx.fillStyle = color;
            starsctx.beginPath();
            starsctx.arc(x, y, radius, 0, 2*Math.PI);
            starsctx.fill();
        }
        
        let glow = (x, y, radius, color = [255, 255, 255], opacity = 1) => {
            // Create a radial gradient
            const gradient = starsctx.createRadialGradient(x, y, 0, x, y, radius);
        
            // Define the color stops
            gradient.addColorStop(0, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`);  // Opaque red at the center
            gradient.addColorStop(1, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0)`);  // Fully transparent at the edges
        
            // Use the gradient to fill the circle
            starsctx.beginPath();
            starsctx.arc(x, y, radius, 0, 2 * Math.PI);
            starsctx.fillStyle = gradient;
            starsctx.fill();
        }
        
        function gr(mean = 0, standardDeviation = 1) {
            let u1 = Math.random();
            let u2 = Math.random();
        
            let z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
            // z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2); 
            // z1 is another independent Gaussian variable if needed
        
            // Scale and shift to match the desired mean and standard deviation
            return z0 * standardDeviation + mean;
        }
        
        for(let i = 0; i < 10000; i++) {
            circle(Math.random()*ww, Math.random()*wh, Math.random()+0.5, 'rgb(195, 193, 231, 0.75)');
        }
        
        for(let i = 0; i < 20000; i++) {
            circle(Math.random()*ww, Math.random()*wh, Math.random()+1, 'rgb(23, 27, 44)');
        }
        
        //Adds purple dots
        for(let i = 0; i < 20000; i++) {
            circle(Math.random()*ww, Math.random()*wh, 1, 'rgba(37, 27, 56, 0.75)')
        }
        
        //Makes natual blue background
        for(let i = 0; i < 80000; i++) {
            circle(Math.random()*ww, Math.random()*wh, 4, 'rgba(27, 29, 74, 0.1)');
        }
        
        //Makes glow clouds
        {
            let colors = [
                [42, 46, 70, 0.15],
                [30, 19, 49, 0.15],
                [33, 34, 51, 0.15],
                [48, 39, 29, 0.05]
            ];
            colors.forEach(color => {
                for(let i = 0; i < 50; i++) {
                    let x = Math.random() * ww;
                    let y = Math.random() * wh;
                    for(let j = 0; j < 100; j++) {
                        let dx = gr(0, ww*0.05);
                        let dy = gr(0, ww*0.05);
                        glow(x + dx, y + dy, 20, color.slice(0, 3), color[3]);
                    }
                }
            });
        }
        
        for(let i = 0; i < 3000; i++) {
            glow(Math.random()*ww, Math.random()*wh, Math.random()*3+1, [195, 193, 231], 0.5);
        }
        
        //End of background
        
        let centers = [];
        for(let i = 0; i < 5; i++) {
            centers.push({
                x: Math.random()*ww*0.8 + ww*0.1,
                y: Math.random()*wh*0.8 + wh*0.1
            });
        }
        
        let secondaryCenters = [];
        for(let i = 0; i < 15; i++) {
            let x = centers[Math.floor(Math.random()*centers.length)].x;
            let y = centers[Math.floor(Math.random()*centers.length)].y;
            secondaryCenters.push({
                x: x + gr(0, ww * 0.1),
                y: y + gr(0, ww * 0.1)
            });
        }
        
        //Makes glows for the center
        [...secondaryCenters, ...centers].forEach(center => {
            let factor = 1;
            if(secondaryCenters.includes(center)) {
                factor = 1/2;
            }
            
            for(let i = 0; i < 300*factor**2; i++) { 
                glow(center.x + gr(0, ww*0.08*factor), center.y + gr(0, ww*0.08*factor), Math.random()*50+10, [73, 93, 146], 0.15);
            }
            for(let i = 0; i < 300*factor**2; i++) {
                glow(center.x + gr(0, ww*0.08*factor), center.y + gr(0, ww*0.08*factor), Math.random()*50+10, [126, 153, 188], 0.15);
            }
        });
        
        //Makes stars in the center
        {
            let colors = ['rgba(191, 171, 180, 0.08)', 'rgba(159, 127, 85, 0.08)', 'rgba(191, 161, 163, 0.08)', 'rgba(194, 154, 155, 0.08)'];
            [...secondaryCenters, ...centers].forEach(center => {
                let factor = 1;
                if(secondaryCenters.includes(center)) {
                    factor = 1/2;
                }
                
                for(let i = 0; i < 20000 * factor; i++) {
                    let colorIndex = Math.floor(Math.random()*colors.length);
                    circle(center.x + gr(0, ww*0.04 * (colorIndex/3+1/3)), center.y + gr(0, ww*0.04 * (colorIndex/3+1/3)), Math.random()*0.5+1, colors[colorIndex]);
                }
            })
        }
        
        {
            [...secondaryCenters, ...centers].forEach(center => {
                let factor = 1;
                if(secondaryCenters.includes(center)) {
                    factor = 1/2;
                }
                
                for(let i = 0; i < 20000 * factor; i++) {
                    circle(center.x + gr(0, ww*0.04), center.y + gr(0, ww*0.04), 0.5 + Math.random()*0.3, 'rgba(138, 140, 165, 0.7)');
                }
        
                for(let i = 0; i < 10000 * factor; i++) {
                    circle(center.x + gr(0, ww*0.02), center.y + gr(0, ww*0.02), 0.5, 'rgba(146, 106, 72, 0.4)');
                }
            })
        }
        
        for(let i = 0; i < 200; i++) {
            glow(Math.random()*ww, Math.random()*wh, Math.random()*3+3, [214, 246, 248], 0.8);
        }
        
        //Makes glows for the center
        [...secondaryCenters, ...centers].forEach(center => {
            let factor = 1;
            if(secondaryCenters.includes(center)) {
                factor = 1/2;
            }
        
            for(let i = 0; i < 75*factor**2; i++) {
                glow(center.x + gr(0, ww*0.05*factor), center.y + gr(0, ww*0.05*factor), Math.random()*50+10, [191, 162, 115], 0.1);
            }
        
            for(let i = 0; i < 30*factor**2; i++) {
                glow(center.x + gr(0, ww*0.03*factor), center.y + gr(0, ww*0.03*factor), Math.random()*50+10, [170, 150, 161], 0.1);
            }
        });

        let weightedArr = [...secondaryCenters, ...centers];
        for(let i = 0; i < weightedArr.length; i++) { //Starts here
            let center = weightedArr[Math.floor(Math.random()*weightedArr.length)];
            let radius = Math.random()*30+100;

            let circleCenter;
            if(center == 'board') {
                circleCenter = {x: Math.random()*window.innerWidth, y: Math.random() * window.innerHeight};
            } else {
                circleCenter = {x: gr(center.x, 100), y: gr(center.y, 100)};
            }

            for(let j = 0; j < 40000; j++) {
                starsctx.fillStyle = 'rgba(123, 99, 121, 0.3)';
                let hypotenuse = gr(0, radius*2);
                let angle = Math.random() * 2 * Math.PI;
                let x = circleCenter.x + Math.cos(angle) * hypotenuse;
                let y = circleCenter.y + Math.sin(angle) * hypotenuse;
                starsctx.beginPath();
                starsctx.arc(x, y, 0.5, 0, 2*Math.PI);
                starsctx.fill();
            }

            for(let j = 0; j < 6000; j++) {
                starsctx.fillStyle = 'rgba(186, 153, 103, 0.3)';
                let hypotenuse = gr(0, radius);
                let angle = Math.random() * 2 * Math.PI;
                let x = circleCenter.x + Math.cos(angle) * hypotenuse;
                let y = circleCenter.y + Math.sin(angle) * hypotenuse;
                starsctx.beginPath();
                starsctx.arc(x, y, 0.5, 0, 2*Math.PI);
                starsctx.fill();
            }
        }
    }

    static withoutGlow() {
        function gr(mean = 0, standardDeviation = 1) {
            let u1 = Math.random();
            let u2 = Math.random();
        
            let z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
            // z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2); 
            // z1 is another independent Gaussian variable if needed
        
            // Scale and shift to match the desired mean and standard deviation
            return z0 * standardDeviation + mean;
        }
    
        let centers = []
        for(let i = 0; i < 3; i++) {
            centers.push({x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight});
        }
    
        let smallCenters = [];
        for(let i = 0; i < 10; i++) {
            let center = Math.floor(Math.random()*5);
            if(center < 3) {
                center = centers[center];
                smallCenters.push({x: gr(center.x, 100), y: gr(center.y, 100)});
            } else {
                smallCenters.push({x: Math.random()*window.innerWidth, y: Math.random() * window.innerHeight});
            }
        }
        let colors = ['rgba(123, 99, 121, 0.3)', 'rgba(186, 153, 103, 0.3)', 'rgba(113, 88, 75, 0.3)'];
        let centerColors = ['rgba(157, 120, 108, 0.3)', 'rgba(124, 91, 85, 0.3)', 'rgba(137, 103, 75, 0.3)', 'rgba(194, 164, 121, 0.3)'];
    
    
        [...centers, ...smallCenters].forEach(center => {
            let radius = Math.random()*30+150;
            for(let j = 0; j < 40000; j++) {
                starsctx.fillStyle = colors[0];
                let hypotenuse = gr(0, radius*2);
                let angle = Math.random() * 2 * Math.PI;
                let x = center.x + Math.cos(angle) * hypotenuse;
                let y = center.y + Math.sin(angle) * hypotenuse;
                starsctx.beginPath();
                starsctx.arc(x, y, 0.5, 0, 2*Math.PI);
                starsctx.fill();
            }
    
            for(let j = 0; j < 8000; j++) {
                starsctx.fillStyle = colors[1];
                let hypotenuse = gr(0, radius);
                let angle = Math.random() * 2 * Math.PI;
                let x = center.x + Math.cos(angle) * hypotenuse;
                let y = center.y + Math.sin(angle) * hypotenuse;
                starsctx.beginPath();
                starsctx.arc(x, y, 0.5, 0, 2*Math.PI);
                starsctx.fill();
            }
    
            for(let j = 0; j < 12000; j++) {
                starsctx.fillStyle = colors[2];
                let hypotenuse = gr(0, radius*2);
                let angle = Math.random() * 2 * Math.PI;
                let x = center.x + Math.cos(angle) * hypotenuse;
                let y = center.y + Math.sin(angle) * hypotenuse;
                starsctx.beginPath();
                starsctx.arc(x, y, 0.5, 0, 2*Math.PI);
                starsctx.fill();
            }
        });
    
        let unweightedArr = [...centers, ...smallCenters];
        let weightedArr = [...centers, ...centers, ...smallCenters, 'board', 'board', 'board', 'board'];
        for(let i = 0; i < 40; i++) {
            let center = weightedArr[Math.floor(Math.random()*weightedArr.length)];
            let radius = Math.random()*30+100;
    
            let circleCenter;
            if(center == 'board') {
                circleCenter = {x: Math.random()*window.innerWidth, y: Math.random() * window.innerHeight};
            } else {
                circleCenter = {x: gr(center.x, 100), y: gr(center.y, 100)};
            }
    
            unweightedArr.push(circleCenter);
    
            for(let j = 0; j < 20000; j++) {
                starsctx.fillStyle = colors[0];
                let hypotenuse = gr(0, radius);
                let angle = Math.random() * 2 * Math.PI;
                let x = circleCenter.x + Math.cos(angle) * hypotenuse;
                let y = circleCenter.y + Math.sin(angle) * hypotenuse;
                starsctx.beginPath();
                starsctx.arc(x, y, 0.5, 0, 2*Math.PI);
                starsctx.fill();
            }
    
            for(let j = 0; j < 3000; j++) {
                starsctx.fillStyle = colors[1];
                let hypotenuse = gr(0, radius*0.5);
                let angle = Math.random() * 2 * Math.PI;
                let x = circleCenter.x + Math.cos(angle) * hypotenuse;
                let y = circleCenter.y + Math.sin(angle) * hypotenuse;
                starsctx.beginPath();
                starsctx.arc(x, y, 0.5, 0, 2*Math.PI);
                starsctx.fill();
            }
        }
    
    
        for(let i = 0; i < unweightedArr.length; i++) {
            for(let j = 0; j < unweightedArr.length; j++) {
                if(i != j) {
                    let c1 = unweightedArr[i];
                    let c2 = unweightedArr[j];
                    if((c1.x - c2.x)**2 + (c1.y - c2.y)**2 < (250)**2) {
                        let angle = Math.atan2(c2.y-c1.y, c2.x-c1.x);
                        for(let o = 0; o < 500; o++) {
                            let distance = gr(250, 50)-250;
                            let center;
                            if(distance > 0) {
                                center = {x: c1.x + Math.cos(angle) * distance, y: c1.y + Math.sin(angle) * distance};
                            } else {
                                center = {x: c2.x + Math.cos(angle) * distance, y: c2.y + Math.sin(angle) * distance};
                            }
                            let newAngle = angle-Math.PI/2;
                            let newDistance = gr(100, 15) - 100;
                            if(newDistance < 10) {
                                starsctx.fillStyle = centerColors[Math.floor(Math.random()*centerColors.length)];
                            } else {
                                starsctx.fillStyle = colors[1];
                            }
                            starsctx.beginPath();
                            starsctx.arc(center.x + Math.cos(newAngle) * newDistance, center.y + Math.sin(newAngle) * newDistance, 0.5, 0, 2*Math.PI);
                            starsctx.fill();
                        }
                    }
                }
            }
        }
    }
}