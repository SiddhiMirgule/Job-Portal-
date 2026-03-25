import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader } from "../../../../components/Loader/Loader";
import { usePageTitle } from "../../../../hooks/usePageTitle";
import { request } from "../../../../utils/api";
import {
  IUser,
  useAuthentication,
} from "../../../authentication/contexts/AuthenticationContextProvider";
import { RightSidebar } from "../../../feed/components/RightSidebar/RightSidebar";
import { About } from "../../components/About/About";
import { Activity } from "../../components/Activity/Activity";
import { Header } from "../../components/Header/Header";
import classes from "./Profile.module.scss";
export function Profile() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const { user: authUser, setUser:setAuthUser } = useAuthentication();
  const [user, setUser] = useState<IUser | null>(null);

  usePageTitle(user?.firstName + " " + user?.lastName);

  useEffect(() => {
    setLoading(true);
    if (id == authUser?.id) {
      setUser(authUser);
      setLoading(false);
    } else {
      request<IUser>({
        endpoint: `/api/v1/authentication/users/${id}`,
        onSuccess: (data) => {
          setUser(data);
          setLoading(false);
        },
        onFailure: (error) => console.log(error),
      });
    }
  }, [authUser, id]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={classes.profile}>
      <section className={classes.main}>
        <Header user={user} authUser={authUser} onUpdate={(user) => setAuthUser(user)} />
        <About user={user} authUser={authUser} onUpdate={(user) => setAuthUser(user)} />
        <Activity authUser={authUser} user={user} id={id} />

        <div className={classes.experience}>
          <h2>Experience</h2>
          {user?.position && user?.company ? (
            <div className={classes.profileItem}>
              <div className={classes.profileItemIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 6h-2.18c.07-.44.18-.86.18-1a3 3 0 00-6 0c0 .14.11.56.18 1H10C8.9 6 8 6.9 8 8v12c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-1a1 1 0 012 0c0 .14-.06.59-.1 1h-1.8c-.04-.41-.1-.86-.1-1zm7 15H10V8h2v2h6V8h2v12z" />
                </svg>
              </div>
              <div>
                <div className={classes.profileItemTitle}>{user.position}</div>
                <div className={classes.profileItemSubtitle}>{user.company}</div>
                {user.location && <div className={classes.profileItemMeta}>{user.location}</div>}
              </div>
            </div>
          ) : (
            <p className={classes.emptySection}>No experience added yet.</p>
          )}
        </div>
        <div className={classes.education}>
          <h2>Education</h2>
          <p className={classes.emptySection}>No education added yet.</p>
        </div>
        <div className={classes.skills}>
          <h2>Skills</h2>
          {user?.position ? (
            <div className={classes.skillTags}>
              {user.position.split(/[,/&]/).map((skill) => skill.trim()).filter(Boolean).map((skill) => (
                <span key={skill} className={classes.skillTag}>{skill}</span>
              ))}
            </div>
          ) : (
            <p className={classes.emptySection}>No skills listed yet.</p>
          )}
        </div>
      </section>
      <div className={classes.sidebar}>
        <RightSidebar />
      </div>
    </div>
  );
}
