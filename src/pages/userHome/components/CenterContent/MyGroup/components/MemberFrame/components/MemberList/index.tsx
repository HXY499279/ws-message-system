import { Space, Skeleton, Empty } from "antd";

interface PropsType {
  style?: any;
  className?: string;
  loading: boolean;
  dataSource: any;
  renderItem: (item: any) => JSX.Element;
}

export const MemberList = (props: PropsType) => {
  const style = props.style;
  const className = props.className;
  const loading = props.loading;
  const dataSource = props.dataSource;
  const renderItem = props.renderItem;

  const LoadingComponent = () => (
    <div style={{ margin: "0 0 10px" }}>
      <Space>
        <Skeleton.Avatar active size="default" shape="circle" />
        <Skeleton.Input style={{ width: 200 }} active size="default" />
      </Space>
    </div>
  );

  if (loading) {
    return (
      <>
        <LoadingComponent />
        <LoadingComponent />
        <LoadingComponent />
        <LoadingComponent />
        <LoadingComponent />
      </>
    );
  } else {
    if(dataSource.length === 0){
      return <Empty style={{margin:"80px 0 0 "}} image={Empty.PRESENTED_IMAGE_SIMPLE} />
    }
    return (
      <div className={className} style={style}>
        {dataSource?.map(renderItem)}
      </div>
    );
  }
};
