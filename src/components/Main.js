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
/*
 *获取区间内的随机值
 */
let getRangeRandom = (low, high) => Math.ceil(Math.random() * (high - low) + low);
/*
 *随机获取0-30正负旋转角度
 */
let get30DegRandom = () => (Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30);
class ImageFigure extends React.Component {
	constructor(props) {
			super(props);
			this.handleClick = this.handleClick.bind(this);
		}
		/*
		 *imageFigure 的点击处理函数
		 */
	handleClick(e) {
		if (this.props.arrange.isCenter) {
			this.props.inverse();
		} else {
			this.props.center()
		}
		e.stopPropagation();
		e.preventDefault();
	}
	render() {
		let styleObj = {};
		if (this.props.arrange.pos) {
			styleObj = this.props.arrange.pos;
		}
		if (this.props.arrange.rotate) {
			const rotate = this.props.arrange.rotate;
			(['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach((value) => {
				styleObj[value] = 'rotate(' + rotate + 'deg)';
			})
		}
		if (this.props.arrange.isCenter) {
			styleObj.zIndex = 11;
		}
		let ImageFigureClassName = 'img-figure';
		ImageFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';
		return (
			<figure className={ImageFigureClassName} style={styleObj} onClick={this.handleClick}>
					<img src={this.props.data.url} alt={this.props.data.title}/>
					<figcaption>
						<h2 className="img-title">{this.props.data.title}</h2>
						<div className="img-back" onClick={this.handleClick}>
	                        <p>
	                          {this.props.data.desc}
	                        </p>
	                    </div>
					</figcaption>
				</figure>
		);
	}
}
class ControllerUnits extends React.Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}
	handleClick(e) {
		if (this.props.arrange.isCenter) {
			this.props.inverse();
		} else {
			this.props.center();
		}
		e.preventDefault();
		e.stopPropagation();
	}
	render() {
		let controllerUnitClassName = 'controller-unit';
		if (this.props.arrange.isCenter) {
			controllerUnitClassName += ' is-center';

			if (this.props.arrange.isInverse) {
				controllerUnitClassName += ' is-inverse';
			}
		}
		return (
			<span className={controllerUnitClassName} onClick={this.handleClick}>
			</span>
		);
	}
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
					},
					rotate:0, //旋转角度
					isInverse:false, //是否翻转
					isCenter:false, //是否居中
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
		 *翻转图片
		 *@param index 输入当前被反转图片的index值
		 *@return {Function}
		 */
	inverse(index) {
			return () => {
				let imgsArrangeArr = this.state.imgsArrangeArr;
				imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
				this.setState({
					imgsArrangeArr: imgsArrangeArr
				})
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
				hPosRangeLeftSecX = hPosRange.leftSecX,
				hPosRangeRighrSecx = hPosRange.rightSecX,
				hPosRangeY = hPosRange.y,
				vPosRangeTopY = vPosRange.topY,
				vPosRangeX = vPosRange.x,
				imgsArrangeTopArr = [],
				topImgNum = Math.floor(Math.random() * 2),
				topImgSpliceIndex = 0,
				imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);
			//居中centerIndex
			imgsArrangeCenterArr[0] = {
				pos: centerPos,
				rotate: 0,
				isCenter: true
			};
			//取出要布局上侧的图片信息
			topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.lengh - topImgNum));
			imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);
			//布局上侧图片
			imgsArrangeTopArr.forEach((value, index) => {
				imgsArrangeTopArr[index] = {
					pos: {
						top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
						left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
					},
					rotate: get30DegRandom(),
					isCenter: false
				}
			});
			//布局左右两侧图片
			for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
				let hPosRangeLORX = null;
				if (i < k) {
					hPosRangeLORX = hPosRangeLeftSecX;
				} else {
					hPosRangeLORX = hPosRangeRighrSecx;
				}
				imgsArrangeArr[i] = {
					pos: {
						top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
						left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
					},
					rotate: get30DegRandom(),
					isCenter: false
				}
			}
			if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
				imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
			}

			imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

			this.setState({
				imgsArrangeArr: imgsArrangeArr
			})
		}
		/*利用rearrange 函数，居中对应index的图片
		 *@param index，需要居中的图片
		 *return {Functoin}
		 */
	center(index) {
		return () => {
			this.rearrange(index);
		}
	}
	componentDidMount() {
		//定义舞台大小
		const stageDom = ReactDOM.findDOMNode(this.refs.stage),
			stageW = stageDom.scrollWidth,
			stageH = stageDom.scrollHeight,
			halfStageW = Math.ceil(stageW / 2),
			halfStageH = Math.ceil(stageH / 2);
		//获取imageFigure大小
		const imgFigureDom = ReactDOM.findDOMNode(this.refs.ImageFigure0),
			imgW = imgFigureDom.scrollWidth,
			imgH = imgFigureDom.scrollHeight,
			halfImgW = Math.ceil(imgW / 2),
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
					},
					rotate: 0,
					isInverse: false,
					isCenter: false
				}
			};
			imgFigures.push(<ImageFigure
				data={value}
				key={index}
				ref={'ImageFigure'+ index}
				arrange={this.state.imgsArrangeArr[index]}
				inverse={this.inverse(index)}
				center={this.center(index)}
				/>);
			controllerUnits.push(<ControllerUnits
				key={index}
				arrange={this.state.imgsArrangeArr[index]}
				inverse={this.inverse(index)}
				center={this.center(index)}
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