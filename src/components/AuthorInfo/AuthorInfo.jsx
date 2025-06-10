import './AuthorInfo.scss'

import GitHubSVG from '../../assets/svg/github.svg?react'
import LinkedInSVG from '../../assets/svg/linkedin.svg?react'

export const AuthorInfo = () => {
  return (
    <div className="author-info">
      <p className="author-info__message">
        Created by <b>Marco Del Boccio</b>
      </p>
      <div className="author-info__icon-box">
        <a href="https://github.com/codentide" target="_blank">
          <GitHubSVG />
        </a>
        <a href="https://www.linkedin.com/in/marco-del-boccio/" target="_blank">
          <LinkedInSVG />
        </a>
      </div>
    </div>
  )
}
