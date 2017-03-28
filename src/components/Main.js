require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';
//获取图片信息
let imageData = require('../data/imageData.json');
//利用自执行函数，获取图片路径信息
imageData = ((imageDataArray) => {
	imageDataArray.forEach((value, index) => {
		imageDataArray[index].url = require('../images/' + imageDataArray[index].fileName);
	})
	return imageDataArray;
})(imageData);
class ImageFigure extends React.Component {
	render() {
		let styleObj={};
		if(this.props.arrange.pos){
			styleObj=this.props.arrange.pos;
			console.log(styleObj);
		}
		return (
			<figure className="img-figure" style={styleObj}>
				<img src={this.props.data.url} alt={this.props.data.title}/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
				</figcaption>
			</figure>
		);
	}
}
/*
*获取区间内的随机值
*/
function gerRangeRandom(low,hight){
	return Math.ceil(Math.random()*(hight-low)+low);
}
class AppComponent extends React.Component {
	constructor(props) {
			super(props);
			this.state = {
				imgsArrangeArr: [
					/*{
						pos:{
							left:'0',
							right:'0'
						}
					}
					*/
				]
			}
			this.Constant = {
				centerPos: {
					left: 0,
					right: 0
				},
				hPosRange: { //水平方向取值范围
					leftSecX: [0, 0],
					rightSecX: [0, 0],
					y: [0, 0]
				},
				vPosRange: { //垂直方向取值范围
					x: [0, 0],
					topY: [0, 0]
				}
			}
		}
		/*
		 *重新布局所有图片
		 *@param 指定需要居中的图片
		 */
	rearrange(centerIndex) {
		let imgsArrangeArr = this.state.imgsArrangeArr,
			Constant = this.Constant,
			centerPos = Constant.centerPos,
			hPosRange = Constant.hPosRange,
			vPosRange = Constant.vPosRange,
			hPosRangeLeftSecX=hPosRange.leftSecX,
			hPosRangeRighrSecx=hPosRange.rightSecX,
			hPosRangeY=hPosRange.y,
			vPosRangeTopY=vPosRangeTopY,
			vPosRangeX=vPosRange.x,
			imgsArrangeTopArr = [],
			topImgNum = Math.ceil(Math.random()),
			topImgSpliceIndex = 0,
			imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);
		//居中centerIndex
		imgsArrangeCenterArr[0].pos = centerPos;
		//取出要布局上侧的图片信息
		topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.lengh - topImgNum));
		imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);
		//布局上侧图片
		imgsArrangeTopArr.forEach((value,index)=>{
			imgsArrangeTopArr[index].pos={
				top:gerRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
				left:gerRangeRandom(vPosRangeX[0],vPosRangeX[1])
			}
		});
		//布局左右两侧图片
		for(let i=0,j=imgsArrangeArr.lengh,k=j/2;i<j;i++){
			let hPosRangeLORX=null;
			if(i<k){
				hPosRangeLORX=hPosRangeLeftSecX;
			}else{
				hPosRangeLORX=hPosRangeRighrSecx;
			}
			imgsArrangeArr[i].pos={
				top:gerRangeRandom(hPosRangeY[0],hPosRangeY[1]),
				left:gerRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
			}
		}
		if(imgsArrangeTopArr&&imgsArrangeTopArr[0]){
			imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
		}

		imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

		this.setState({
			imgsArrangeArr:imgsArrangeArr
		})
	}
	componentDidMount() {
		//定义舞台大小
		const stageDom = ReactDOM.findDomNode(this.refs.stage),
			stageW = stageDom.scrollWidth,
			stageH = stageDom.scrollHeight,
			halfStageW = Math.ceil(stageW / 2),
			halfStageH = Math.ceil(stageH / 2);
		//获取imageFigure大小
		const imgFigureDom = ReactDOM.findDomNode(this.refs.ImageFigure0),
			imgW = imgFigureDom.scrollWidth,
			imgH = imgFigureDom.scrollHeight,
			halfImgW = Math.ceill(imgW / 2),
			halfImgH = Math.ceil(imgH / 2);
		//计算中心图片位置
		this.Constant.centerPos = {
				left: halfStageW - halfImgW,
				top: halfStageH - halfImgH
			}
			//水平方向位置
		this.Constant.hPosRange = {
				leftSecX: [-halfImgW, halfStageW - halfImgW * 3],
				rightSecX: [halfStageW + halfImgW, stageW - halfImgW],
				y: [-halfImgH, stageH - halfImgH]
			}
			//垂直方向位置
		this.Constant.vPosRange = {
			topY: [-halfImgH, halfStageH - halfImgH * 3],
			x: [halfStageW - imgW, halfStageW]
		}
		this.rearrange(0);
	}
	render() {
		let controllerUnits = [],
			imgFigures = [];
		imageData.forEach((value, index) => {
			if (!this.state.imgsArrangeArr[index]) {
				this.state.imgsArrangeArr[index] = {
					pos: {
						left: 0,
						right: 0
					}
				}
			}
			imgFigures.push(<ImageFigure
				data={value}
				ref={'ImageFigure'+ index}
				arrange={this.state.imgsArrangeArr[index]}
				/>);
		});
		return (
			<section className="stage" ref="stage">
				<section className="img-sec">
					{imgFigures}
				</section>
				<nav className="controller-nav">
					{controllerUnits}
				</nav>
			</section>
		);
	}
}

AppComponent.defaultProps = {};

export default AppComponent;