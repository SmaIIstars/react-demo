# D3-Force

基于 _d3.js_ 实现的力导图 React 组件。

## 使用

### 基本使用

```tsx
const nodes = [
  {
    id: "Donald",
    name: "Donald",
  },
  {
    id: "Bernie",
    name: "Bernie",
  },
  {
    id: "Jill",
    name: "Jill",
  },
];

const links = [
  {
    source: 0,
    target: 1,
  },
  {
    source: 0,
    target: 2,
  },
  {
    source: 1,
    target: 2,
  },
];

const D3Force = () => {
  return <D3Force data={{ nodes, links }}></D3Force>;
};
```

### 自定义内容

```tsx
const D3Force = () => {
  return;
  <D3Force
    data={{ nodes, links }}
    Node={
      <>
        {nodes.map((node, index) => {
          return <circle r={10} key={index} />;
        })}
      </>
    }
    Link={
      <>
        {links.map((link, index) => {
          return (
            <line
              style={{
                stroke: "rgb(1, 1, 204)",
                strokeWidth: 1,
              }}
              key={index}
            />
          );
        })}
      </>
    }
  ></D3Force>;
};
```

**如果使用 children 方式，需要注意把 Link 写在 Node 之前**

```tsx
const D3Force = () => {
  return (
    <>
      <h1>Home</h1>
      <D3Force data={{ nodes, links }}>
        <>
          {links.map((link, index) => {
            return (
              <line
                style={{
                  stroke: "rgb(1, 1, 204)",
                  strokeWidth: 1,
                }}
                key={index}
              />
            );
          })}
        </>
        <>
          {nodes.map((node, index) => {
            return <circle r={10} key={index} />;
          })}
        </>
      </D3Force>
    </>
  );
};
```

### 额外的事件绑定

**如果需要 D3Force 中的实例对象，通过 ref 调用暴露出来的 getInstances 获取实例**

```tsx
const D3Force = () => {
  const d3ForceRef = useRef<any>();
  const [instances, setInstances] = useState<any>({});

  useEffect(() => {
    setInstances(d3ForceRef.current?.getInstances());
  }, []);

  return (
    <>
      {instances && (
        <D3Force
          data={{ nodes, links }}
          options={{
            bindEvents: [
              {
                targeDom: "svg",
                event: d3ForceZoom(),
              },
              {
                targeDom: "nodeEls",
                event: d3ForceDrag(instances.simulation),
              },
            ],
          }}
          ref={d3ForceRef}
        ></D3Force>
      )}
    </>
  );
};
```

## API

### D3Force

|  参数   |       说明       |             类型              | 默认值 |
| :-----: | :--------------: | :---------------------------: | :----: |
|  data   |     数据对象     | { nodes: any[]; links: any[]} |        |
| options |     功能参数     |           IOptions            |   {}   |
|  Node   | 自定义 node 节点 |              JSX              |        |
|  Link   | 自定义 link 节点 |              JSX              |        |

### IOptions

|    参数    |       说明       |                                         类型                                         |  默认值  |
| :--------: | :--------------: | :----------------------------------------------------------------------------------: | :------: |
|   isDrag   |    是否能拖拽    |                                       boolean                                        |   true   |
|   isZoom   |  是否能放大缩小  |                                       boolean                                        |   true   |
|    zoom    |     缩放比例     |                                   [number,number]                                    | [0.4, 2] |
|   forces   | 额外的力模型对象 | {[key: string]: Force<SimulationNodeDatum,SimulationLinkDatum<SimulationNodeDatum>>} |    []    |
| bindEvents |  额外的绑定事件  |                                     IBindEvent[]                                     |    []    |

### IBindEvent

|   参数   |    说明    |              类型               | 默认值 |
| :------: | :--------: | :-----------------------------: | :----: |
| targeDom | 绑定的目标 | "svg" \| "nodeEls" \| "linkEls" |        |
|  event   | 绑定的事件 |               any               |        |
