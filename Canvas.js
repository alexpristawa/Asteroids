class Canvas {

    static startX;
    static startY;
    static multiplier;
    static animations = [];

    static rect(x, y, width, height, borderRadius=0, border=true) {
        if(borderRadius == 0) {
            if(Canvas.multiplier != undefined) {
                x *= Canvas.multiplier;
                y *= Canvas.multiplier;
                width *= Canvas.multiplier;
                height *= Canvas.multiplier;
            }
            if(Canvas.startX != undefined) x += Canvas.startX;
            if(Canvas.startY != undefined) y += Canvas.startY;
    
            ctx.beginPath();
            ctx.rect(x, y, width, height);
            ctx.fill();
            if(border) {
                ctx.stroke();
            }
        } else {
            if(Canvas.multiplier != undefined) {
                x *= Canvas.multiplier;
                y *= Canvas.multiplier;
                width *= Canvas.multiplier;
                height *= Canvas.multiplier;
            }
            if(Canvas.startX != undefined) x += Canvas.startX;
            if(Canvas.startY != undefined) y += Canvas.startY;
    
            if (width < 2 * borderRadius) borderRadius = width / 2;
            if (height < 2 * borderRadius) borderRadius = height / 2;
            ctx.beginPath();
            ctx.moveTo(x + borderRadius, y);
            ctx.arcTo(x + width, y, x + width, y + height, borderRadius);
            ctx.arcTo(x + width, y + height, x, y + height, borderRadius);
            ctx.arcTo(x, y + height, x, y, borderRadius);
            ctx.arcTo(x, y, x + width, y, borderRadius);
            ctx.closePath();
            // Fill or stroke the rectangle
        
            ctx.fill();
            if(border) {
                ctx.stroke();
            }
        }
    }

    static circle(x, y, radius, border) {
        if(Canvas.multiplier != undefined) {
            x *= Canvas.multiplier;
            y *= Canvas.multiplier;
            radius *= Canvas.multiplier;
        }
        if(Canvas.startX != undefined) x += Canvas.startX;
        if(Canvas.startY != undefined) y += Canvas.startY;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2*Math.PI, false);
        ctx.fill();
        if(border) ctx.stroke();
    }

    static line(x1, y1, x2, y2, circularBorder=false) {
        if(Canvas.multiplier != undefined) {
            x1 *= Canvas.multiplier;
            x2 *= Canvas.multiplier;
            y1 *= Canvas.multiplier;
            y2 *= Canvas.multiplier;
        }
        if(Canvas.startX != undefined) {
            x1 += Canvas.startX;
            x2 += Canvas.startX;
        }
        if(Canvas.startY != undefined) {
            y1 += Canvas.startY;
            y2 += Canvas.startY;
        }

        const originalFillStyle = ctx.fillStyle;
    
        const radius = ctx.lineWidth / 2;
    
        // Draw the line
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    
        if (circularBorder) {
            ctx.fillStyle = ctx.strokeStyle;
    
            // Draw a circle at the starting point
            ctx.beginPath();
            ctx.arc(x1, y1, radius, 0, Math.PI * 2, true);
            ctx.fill();
    
            // Draw a circle at the ending point
            ctx.beginPath();
            ctx.arc(x2, y2, radius, 0, Math.PI * 2, true);
            ctx.fill();
    
            ctx.fillStyle = originalFillStyle;
        }
    }

    static cylinder(x, y, radius, dy, outerColor, innerColor, border) {
        if(Canvas.multiplier != undefined) {
            x *= Canvas.multiplier;
            y *= Canvas.multiplier;
            radius *= Canvas.multiplier;
            dy *= Canvas.multiplier;
        }
        if(Canvas.startX != undefined) x += Canvas.startX;
        if(Canvas.startY != undefined) y += Canvas.startY;

        ctx.fillStyle = outerColor;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2*Math.PI, false);
        ctx.fill();

        ctx.beginPath();
        ctx.rect(x-radius, y, 2*radius, dy);
        ctx.fill();
        if(border) ctx.stroke();

        ctx.fillStyle = innerColor;
        ctx.beginPath();
        ctx.arc(x, y+dy, radius, 0, 2*Math.PI, false);
        ctx.fill();
        if(border) ctx.stroke();
    }
    
    static drawWithAngle(x, y, angle, img, width, height='Square') {
        if(height == "Square") height = width;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        ctx.drawImage(img, -width/2, -height/2, width, height);
        ctx.restore();
    }

    static glow(x, y, radius, color = [255, 255, 255]) {
        // Create a radial gradient
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);

        // Define the color stops
        gradient.addColorStop(0, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 1)`);  // Opaque red at the center
        gradient.addColorStop(1, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0)`);  // Fully transparent at the edges

        // Use the gradient to fill the circle
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = gradient;
        ctx.fill();
    }

    static drawQueue() {
        for(let i = 0; i < Canvas.animations.length; i++) {
            let animation = Canvas.animations[i];
            animation.func();
            animation.framesLeft--;
            if(animation.framesLeft == 0) {
                Canvas.animations.splice(Canvas.animations.indexOf(animation), 1);
                i--;
            }
        }
    }

}