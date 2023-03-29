<template>
	<view :style="viewColor">
		<view class="container" :class="isShow==true?'on':''" @click.stop="loseFocus">
			<view class="main_content">
				<view class="header">
					<text class="title">评论 {{all}}</text>
					<text class="iconfont icon-guanbi5" @click="close"></text>
				</view>
				<view class="main">
					<scroll-view scroll-y="true">
						<view v-if="list.length > 0" @touchmove="onTouchmove" id="reply">
						 
							<view class="common_list" v-for="(item, index) in list" :key="index">
								<view class="commen_one">
									<image :src="(item.author&&item.author.avatar) || '/static/images/f.png'" class="image"></image>
								</view>
								<view class="info_count">
									<view class="info">
										<view class="message" @click.stop="toReply(item,index)">
											<view v-if="item.author" class="name">{{item.author.nickname}}</view>
											<view class="desc">{{item.content}}</view>
											<view class="time">{{item.create_time}}</view>
										</view>
										<view class="like" @click.stop="starComment(item)">
											<view class="iconfont":class="item.relevance_id ? 'icon-yidianzan' : 'icon-dianzan1'"></view>
											
											{{item.count_start}}
										</view>
									</view>
									<view v-if="item.children && item.children.length > 0" class="reply_count">
										<view v-for="(itemn,indexn) in item.children" :key="indexn" class="reply_list">
											<view class="item">
												<view class="item_count" @click.stop="toReply(itemn,index)">
													<image class="image" :src="itemn.author && itemn.author.avatar || '/static/images/f.png'"></image>
													<view v-if="itemn.author" class="name_two">{{itemn.author.nickname}}</view>
													<view class="desc_two">
														<text class="reply_user" v-if="itemn.reply">回复 @{{itemn.reply.nickname}} </text> {{itemn.content}}
													</view>
													<view class="time_two">{{itemn.create_time}}</view>
												</view>
												<view class="like_two" @click.stop="starComment(itemn)">
													<view class="iconfont":class="itemn.relevance_id ? 'icon-yidianzan' : 'icon-dianzan1'"></view>
													
													{{itemn.count_start}}
												</view>
											</view>
										</view>
										
									</view>
									
								</view>	
							</view>
							<view class="end"><text>到底了</text></view>
						</view>
						<Loading :loaded="loaded" :loading="loading"></Loading>
						<view v-if="list.length == 0 && !loading" class="empty">
							<image src="/static/images/no_commen.png"></image>
							<text>暂无评论，快去抢沙发吧~</text>
						</view>
						
					</scroll-view>
					
				</view>	
			</view>
			<view class="release_bar">	
				<view class="input_count">
					<input type="text" :placeholder="placeholder" placeholder-style="color: #999999; font-size: 26rpx;" v-model="content" :focus="focus" confirm-type="search">	
				</view>
				<button class="send" @click.stop="submitComment">发送</button>
			</view>
		</view>
		<view class='mask' catchtouchmove="true" :hidden='isShow==false' @tap="close"></view>
	</view>
	
</template>

<script>
	import { replyLstApi, starCommentApi, replyCreateApi } from '@/api/community.js';
	import Loading from '@/components/Loading/index.vue';
	import { mapGetters } from "vuex";
	export default {
		props:{
			isShow: {
				type: Boolean,
				default: false
			}
		},
		components: {
		  Loading
		},
		computed: mapGetters(['viewColor']),
		data() {
			return {
				content: '',
				id: "",
				list: [],
				loaded: false,
				loading: false,
				where: {
					page: 1,
					limit: 10
				},
				reply_id: "",
				placeholder: "快来说点儿什么吧...",
				isChild: false,
				index: 0,
				listIndex: 0,
				focus: false,
				all: 0
			};
		},
		methods: {
			// 点击关闭按钮
			close() {
				this.$emit('close');
			},
			onTouchmove(e){
				if (this.loadend || this.loading) return;
				const query = uni.createSelectorQuery().in(this);
				query.select('#reply').boundingClientRect(data => {
					console.log(data)
					if(data.bottom < 1500 && data.top < 0) {
						this.getList();	
					}
				}).exec();
				// 模拟触底刷新
			},
			getData(item,index){
				this.id = item.community_id
				this.loading = this.loaded = false
				this.where.page = 1
				this.list = []
				this.getList()
				this.listIndex = index
			},
			getList(){
				let that = this;
				if(that.loading || that.loaded) return;
				that.loading = true;
				replyLstApi(that.id,that.where).then(res => {
				    that.loading = false;
					that.all = res.data.all;
				    that.loaded = res.data.list.length < that.where.limit;
				    that.list.push.apply(that.list, res.data.list);
				    that.where.page = that.where.page + 1;
				  },
				  error => {
				    that.$util.Tips({
				      title: error.msg
				    })
				  }
				);
			},
			/*发表评论*/
			submitComment(){
				let that = this;
				let reply_id = that.reply_id ? that.reply_id : 0
				replyCreateApi(that.id,{content: that.content,reply_id: reply_id}).then(res => {
					that.$util.Tips({
						title: res.message
					});
					if(that.isChild){
						if(that.list[that.index]['children']){
							that.list[that.index]['children'].push(res.data)
						}else{
							that.list[that.index]['children'] = [res.data]
						}
					}else{
						that.list.unshift(res.data)
					}
					that.all++
					that.content = ""	
					that.$util.Tips({
						title: res.message
					});
					that.$emit('successFul',that.listIndex);
					that.loseFocus()
				});
			},
			toReply(item,index){
				this.content = ""
				this.placeholder = '回复：'+item.author.nickname
				this.reply_id = item.reply_id
				this.isChild = true
				this.index = index;
				this.focus = true;
			},
			loseFocus(){
				this.focus = false;
				this.reply_id = 0;
				this.placeholder = "快来说点儿什么吧..."
				this.isChild = false
				// this.content = ""
			},
			/*点赞评论*/
			starComment(item){
				let that = this;
				let status = item.relevance_id ? 0 : 1
				starCommentApi(item.reply_id,{status: status}).then(res => {
					if (res.status === 200) {
						if(item.relevance_id){
							item.count_start--;
							item.count_start = item.count_start == 0 ? 0 : item.count_start
							item.relevance_id = false
						}else{
							item.count_start++;
							item.relevance_id = true
						}
					}
					that.$util.Tips({
						title: res.message
					});
				}).catch(err => {
					uni.showToast({
						title: err,
						icon: 'none'
					})
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	
.container{
	background: #ffffff;
	border-radius: 16rpx 16rpx 0 0;
	position: relative;
	position: fixed;
	bottom: 0;
	width: 100%;
	left: 0;
	background-color: #f5f5f5;
	z-index: 1000;
	border-radius: 16rpx 16rpx 0 0;
	transform: translate3d(0, 100%, 0);
	transition: all .3s cubic-bezier(.25, .5, .5, .9);	
	&.on {
		transform: translate3d(0, 0, 0);
	}
	.main_content{
		padding: 24rpx 30rpx 0;
		border-bottom: 1rpx solid #F5F5F5;
		margin-bottom: 100rpx;
	}
	.header{
		position: relative;
		text-align: center;
		.title{
			color: #282828;
			font-size: 36rpx;
			font-weight: bold;
		}
		.iconfont{
			color: #8A8A8A;
			font-size: 36rpx;
			position: absolute;
			top: 4rpx;
			right: 0;
		}		
	}
}
scroll-view{
	height: 60vh;
}
.main{
	margin-top: 60rpx;
	padding-bottom: 20rpx;
	.common_list{
		position: relative;
		padding-left: 94rpx;
		margin-bottom: 20rpx;
		.commen_one{
			position: absolute;
			top: 0;
			left: 0;
			.image,uni-image{
				width: 74rpx;
				height: 74rpx;
				border-radius: 100%;
			}
				
		}
		.info{
			position: relative;
			padding-right: 90rpx;
			
		}
		.name,.name_two{
			color: #999999;
			font-size: 26rpx;
		}
		.desc,.desc_two{
			color: #282828;
			font-size: 28rpx;
			margin-top: 10rpx;
		}
		.desc_two{
			font-size: 26rpx;
			.reply_user{
				font-size: 24rpx;
				color: #4A8AC9;
				margin: 0 6rpx;
			}
		}
		.time,.time_two{
			color: #BBBBBB;
			font-size: 22rpx;
			margin-top: 15rpx;
		}
		.like,.like_two{
			color: #999999;
			font-size: 26rpx;
			text-align: center;
			position: absolute;
			top: 0;
			right: 0;
			width: 75rpx;
			.icon-yidianzan{
				color: var(--view-theme);
			}
		}
		.reply_list{
			margin-top: 20rpx;
			.item{
				padding-right: 140rpx;
				position: relative;
			}
			.item_count{
				position: relative;
				padding-left: 56rpx;
				.image,un-image{
					width: 36rpx;
					height: 36rpx;
					border-radius: 100%;
					position: absolute;
					top: 0;
					left: 0;
				}
			}
		}
	}
	.end{
		margin-top: 50rpx;
		text-align: center;
		text{
			color: #999999;
			font-size: 22rpx;
			position: relative;
			&::before,&::after{
				content: "";
				display: inline-block;
				width: 22rpx;
				height: 1rpx;
				background: #999999;
				position: absolute;
				top: 18rpx;
				opacity: .5;
			}
			&::before{
				left: -30rpx;
			}
			&::after{
				right: -30rpx;
			}
		}
	}
}
.release_bar{
	position: fixed;
	width: 100%;
	bottom: 0;
	left: 0;
	background: #ffffff;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 15rpx 30rpx;
	border-top: 1rpx solid #F5F5F5;
	.avatar,image,uni-image{
		width: 54rpx;
		height: 54rpx;
		border-radius: 100%;
	}
	.input_count{
		width: 550rpx;
		background: #F7F7F7;
		border-radius: 31rpx;
		padding: 12rpx 30rpx;
	}
	.send{
		font-size: 26rpx;
		color: #ffffff;
		padding: 12rpx 30rpx;
		background-image: linear-gradient(126deg, var(--view-bntColor21) 0%, var(--view-bntColor22) 100%);
		border-radius: 30rpx;
		text-align: center;
	}
}
.empty{
	margin: 130rpx 0 150rpx;
	text-align: center;
	image,uni-image{
		display: inline-block;
		width: 414rpx;
		height: 305rpx;
	}
	text{
		display: block;
		color: #999999;
		font-size: 26rpx;
	}
}
</style>
