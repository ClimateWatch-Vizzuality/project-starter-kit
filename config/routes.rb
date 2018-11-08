Rails.application.routes.draw do
  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)
  root 'application#index'
  get '(*frontend)', to: 'application#index'
end
