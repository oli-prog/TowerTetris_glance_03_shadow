import { Vec2 } from "./Vec2.js";

export class Rect
{
    public x: number;
    public y: number;
    public width: number;
    public height: number;

    // Static methods ----------------------------------------------------------

    public static unionOf(rects: Rect[]): Rect
    {
        if (rects.length === 0) {
            return new Rect();
        }
        let result = rects[0].clone();
        for (let i = 1; i < rects.length; i++) {
            result.union(rects[i]);
        };
        return result;
    }

    // Instance methods --------------------------------------------------------

    constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    public clone(): Rect
    {
        return new Rect(this.x, this.y, this.width, this.height);
    }

    public set(x: number, y: number, width: number, height: number): Rect
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        return this;
    }

    /// Various properties for convenience.
    get size(): Vec2 { return new Vec2(this.width, this.height); }
    set size(value: Vec2) { this.width = value.x; this.height = value.y; }

    get left(): number { return this.x; }
    set left(value: number) { this.x = value; }

    get top(): number { return this.y; }
    set top(value: number) { this.y = value; }

    get right(): number { return this.x + this.width; }
    set right(value: number) { this.width = Math.max(0, value - this.x); }

    get bottom(): number { return this.y + this.height; }
    set bottom(value: number) { this.height = Math.max(0, value - this.y); }

    get topLeft(): Vec2 { return new Vec2(this.x, this.y); }
    get topRight(): Vec2 { return new Vec2(this.x + this.width, this.y); }
    get bottomLeft(): Vec2 { return new Vec2(this.x, this.y + this.height); }
    get bottomRight(): Vec2 { return new Vec2(this.x + this.width, this.y + this.height); }
    get center(): Vec2 { return new Vec2(this.x + this.width * 0.5, this.y + this.height * 0.5); }

    /// Checks if the given point is inside the rectangle.
    public contains(x: number, y: number): boolean
    {
        return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
    }

    /// Expands this rectangle to include the other.
    public union(other: Rect): void
    {
        const oldRight = this.right;
        const oldBottom = this.bottom;
        this.x = Math.min(this.x, other.x);
        this.y = Math.min(this.y, other.y);
        this.width = Math.max(oldRight, other.right) - this.x;
        this.height = Math.max(oldBottom, other.bottom) - this.y;
    }

    /// Replace this rectangle with the union of the given.
    public unionOf(rects: Array<Rect>): Rect
    {
        if (rects.length === 0) {
            this.x = this.y = this.width = this.height = 0;
        } else {
            this.x = rects[0].x;
            this.y = rects[0].y;
            this.width = rects[0].width;
            this.height = rects[0].height;
            for (let i = 1; i < rects.length; i++) {
                this.union(rects[i]);
            }
        }
        return this;
    }

    /// Checks if this rect is empty.
    public isEmpty(): boolean
    {
        return this.width <= 0 || this.height <= 0;
    }

    /// Expands this rectangle to include the given point.
    public include(x: number, y: number): Rect
    {
        if (x < this.x) {
            this.width += this.x - x;
            this.x = x;
        } else if (x > this.right) {
            this.width = x - this.x;
        }
        if (y < this.y) {
            this.height += this.y - y;
            this.y = y;
        } else if (y > this.bottom) {
            this.height = y - this.y;
        }
        return this;
    }

    /// Grows the rectangle by the given amount in all directions.
    public grow(amount: number): Rect
    {
        this.x -= amount;
        this.y -= amount;
        this.width += amount * 2;
        this.height += amount * 2;
        return this;
    }
}

// This is used to identify Rect objects in the code.
// It is stored as a property on the prototype so that does not take up
// any space in the actual object, but one can still access it.
(Rect.prototype as any).isRect = true;
