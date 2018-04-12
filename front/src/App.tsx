import * as Bluebird from 'bluebird';
import * as React from 'react';
import './App.css';

import { Card } from 'antd';

// interface部分相当于对对象的描述, 可以先不理会
/**
 * 用户概览数据定义
 */
interface UserData {
  enabled: number;
  sum: number;
}

/**
 * 角色概览数据定义
 */
interface RoleData {
  bind: number;
  sum: number;
}

/**
 * 任务概览数据定义
 */
interface TaskData {
  todo: number;
  sum: number;
}

/**
 * 项目概览数据定义
 */
interface ProjectData {
  healthy: number;
  sum: number;
}

const logo = require('./logo.svg');

class App extends React.Component {
  /**
   * 后端接口的根地址
   * 这里因为不使用webpack或nginx做代理跨域
   * 所以可临时这样写
   */
  public apiRoot = 'http://127.0.0.1:8088';

  public gridStyle = {
    width: '25%',
    textAlign: 'center'
  } as React.CSSProperties;

  state = {
    loading: true,
    userData: { enabled: 0, sum: 0 } as UserData,
    roleData: { bind: 0, sum: 0 } as RoleData,
    taskData: { todo: 0, sum: 0 } as TaskData,
    projectData: { healthy: 0, sum: 0 } as ProjectData
  };

  /**
   * 简单封装一下fetch的get方法, 并且Promise化.
   * @param url api的后半部分url
   */
  public getResBody(url: string) {
    return new Bluebird((resolve, reject) => {
      fetch(this.apiRoot + url).then(async res => {
        // 使用async/await方式避免then的调用
        const result = await res.json();
        if (result.code === 0) {
          resolve(result.data);
        } else {
          resolve({});
        }
      });
    });
  }

  /**
   * 简单封装一下fetch的get方法, 并且Promise化.
   * 此方法与new Bluebird方法比相对简洁
   * 因为到在我们的事例中是用不到reject的.
   * 一定要注意下面的return, 一个都不能少.
   * @param url api的后半部分url
   */
  public getResBodyByResolve(url: string) {
    return Bluebird.resolve().then(() => {
      return fetch(this.apiRoot + url).then(async res => {
        // 使用async/await方式避免then的调用
        const result = await res.json();
        if (result.code === 0) {
          return result.data;
        } else {
          return {};
        }
      });
    });
  }

  /**
   * 使用PromiseAll方法
   * 实现等待多个接口查询完毕后再显示Card的结果
   */
  public getSurvey() {
    // 这不用await的原因是因为await会阻塞这四个请求
    // 也就是说如果用await就需要前一个请求的接口得到结果之后才会请求下一个接口
    // 而使用PromiseAll就能按照请求书写顺序发送四个请求(非并发)
    // 并同时等待四个请求有了回复才进行下一步操作
    // 值得注意的是, 这里的四个请求的发起不是并发的
    // 但是每个请求都不需要等待上一个请求完毕后才执行下一个请求
    const userSurveyPro = this.getResBody('/api/user-survey');
    const roleSurveyPro = this.getResBody('/api/role-survey');
    const taskSurveyPro = this.getResBody('/api/task-survey');
    const projectSurveyPro = this.getResBody('/api/project-survey');

    // all方法里需要传入数组, 即使只传一个的时候也要包在数组里
    // 当然, 如果只传一个的话, 就不需要用all了
    // 传入数组里的对象必须为Promise对象
    Bluebird.all([userSurveyPro, roleSurveyPro, taskSurveyPro, projectSurveyPro]).then(surveyList => {
      this.setState({
        userData: surveyList[0],
        roleData: surveyList[1],
        taskData: surveyList[2],
        projectData: surveyList[3],
        loading: false
      });
    });
  }

  public getSurveyByResolve() {
    // 这不用await的原因是因为await会阻塞这四个请求
    // 也就是说如果用await就需要前一个请求的接口得到结果之后才会请求下一个接口
    // 而使用PromiseAll就能按照请求书写顺序发送四个请求(非并发)
    // 并同时等待四个请求有了回复才进行下一步操作
    // 值得注意的是, 这里的四个请求的发起不是并发的
    // 但是每个请求都不需要等待上一个请求完毕后才执行下一个请求
    const userSurveyPro = this.getResBodyByResolve('/api/user-survey');
    const roleSurveyPro = this.getResBodyByResolve('/api/role-survey');
    const taskSurveyPro = this.getResBodyByResolve('/api/task-survey');
    const projectSurveyPro = this.getResBodyByResolve('/api/project-survey');

    // all方法里需要传入数组, 即使只传一个的时候也要包在数组里
    // 当然, 如果只传一个的话, 就不需要用all了
    // 传入数组里的对象必须为Promise对象
    Bluebird.all([userSurveyPro, roleSurveyPro, taskSurveyPro, projectSurveyPro]).then(surveyList => {
      this.setState({
        userData: surveyList[0],
        roleData: surveyList[1],
        taskData: surveyList[2],
        projectData: surveyList[3],
        loading: false
      });
    });
  }

  componentDidMount() {
    this.getSurvey();
    // 此方法仅是上面方法的简洁版
    // this.getSurveyByResolve();
  }

  render() {
    const { loading, userData, roleData, taskData, projectData } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">欢迎来到Promise.all的学习Demo</h1>
        </header>
        <Card title="概览仪表盘" loading={loading}>
          <Card.Grid style={this.gridStyle}>
            <h3>用户概览</h3>
            启用数: {userData.enabled} <br />
            总数: {userData.sum}
          </Card.Grid>
          <Card.Grid style={this.gridStyle}>
            <h3>角色概览</h3>
            被绑定数: {roleData.bind} <br />
            总数: {roleData.sum}
          </Card.Grid>
          <Card.Grid style={this.gridStyle}>
            <h3>任务概览</h3>
            未完成数: {taskData.todo} <br />
            总数: {taskData.sum}
          </Card.Grid>
          <Card.Grid style={this.gridStyle}>
            <h3>项目概览</h3>
            健康数: {projectData.healthy} <br />
            总数: {projectData.sum}
          </Card.Grid>
        </Card>
      </div>
    );
  }
}

export default App;
