import React, { createRef, useLayoutEffect, useRef } from "react";

type DrawingProps = {
	className?: string;
	style?: React.CSSProperties;
	canvasStyle?: React.CSSProperties;
};

export default class DrawingCanvas extends React.Component<DrawingProps> {

	canvasContainer = createRef<HTMLDivElement>();
	canvas = createRef<HTMLCanvasElement>();

	constructor(props: DrawingProps) {
		super(props);
	}

	render(): React.ReactNode {
		return (
			<div
				className={this.props.className}
				style={{
					//Add default css here later
					...this.props.style
				}}
				ref={this.canvasContainer}
			>
				<canvas 
					ref={this.canvas}
					style={{ ...this.props.canvasStyle }} 
				/>

			</div>
		);
	}
}
